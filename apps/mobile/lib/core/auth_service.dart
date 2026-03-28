import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'models.dart';

const _tokenKey = 'medlearn_access_token';

class AuthService extends ChangeNotifier {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  final String _baseUrl;

  UserProfile? _currentUser;
  String? _accessToken;
  bool _isLoading = true;

  AuthService(this._baseUrl);

  UserProfile? get currentUser => _currentUser;
  String? get accessToken => _accessToken;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _accessToken != null;

  /// On app boot, try to restore the saved token from secure storage.
  Future<void> init() async {
    _isLoading = true;
    notifyListeners();

    try {
      final savedToken = await _storage.read(key: _tokenKey);
      if (savedToken != null) {
        _accessToken = savedToken;
        await _fetchCurrentUser();
      }
    } catch (e) {
      // Silently fail — token is expired or invalid, user will be sent to login.
      await signOut();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signIn(String email, String password) async {
    final res = await http.post(
      Uri.parse('$_baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    final data = jsonDecode(res.body);
    if (res.statusCode != 200) {
      throw Exception(data['message'] ?? 'Login failed');
    }

    _accessToken = data['data']['tokens']['accessToken'] as String;
    await _storage.write(key: _tokenKey, value: _accessToken);
    await _fetchCurrentUser();
    notifyListeners();
  }

  Future<void> signUp({
    required String fullName,
    required String email,
    required String password,
    required String examTrack,
  }) async {
    final res = await http.post(
      Uri.parse('$_baseUrl/auth/signup'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'fullName': fullName,
        'email': email,
        'password': password,
        'examTrack': examTrack,
      }),
    );

    final data = jsonDecode(res.body);
    if (res.statusCode != 201) {
      throw Exception(data['message'] ?? 'Sign up failed');
    }

    _accessToken = data['data']['tokens']['accessToken'] as String;
    await _storage.write(key: _tokenKey, value: _accessToken);
    await _fetchCurrentUser();
    notifyListeners();
  }

  Future<void> signOut() async {
    _accessToken = null;
    _currentUser = null;
    await _storage.delete(key: _tokenKey);
    notifyListeners();
  }

  Future<void> _fetchCurrentUser() async {
    if (_accessToken == null) return;

    final res = await http.get(
      Uri.parse('$_baseUrl/auth/me'),
      headers: {'Authorization': 'Bearer $_accessToken'},
    );

    if (res.statusCode == 200) {
      final raw = jsonDecode(res.body)['data'];
      _currentUser = _parseUser(raw);
    } else {
      // Token might be expired — clear it
      await signOut();
    }
  }

  static UserProfile _parseUser(Map<String, dynamic> raw) {
    return UserProfile(
      id: raw['id'],
      fullName: raw['fullName'],
      email: raw['email'],
      role: raw['role'] == 'admin' ? UserRole.admin : UserRole.student,
      examTrack: raw['examTrack'] ?? 'MBBS',
      streakDays: raw['streakDays'] ?? 0,
      weeklyGoalHours: 10,
      completedCourses: 0,
      averageQuizScore: 0,
      weakTopics: List<String>.from(raw['weakTopics'] ?? []),
      strongTopics: List<String>.from(raw['strongTopics'] ?? []),
    );
  }
}
