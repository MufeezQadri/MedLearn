import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'models.dart';

class MedLearnApi {
  // Your Mac's local Wi-Fi IP — iPhone must be on same network
  static const String baseUrl = 'http://192.168.1.81:4000/api';

  static Future<List<Course>> getCourses() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/courses'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final list = data['data'] as List;
        return list.map((json) => Course(
          id: json['id'],
          title: json['title'],
          description: json['description'] ?? '',
          subject: json['subject'] ?? '',
          section: json['section'] ?? '',
          difficulty: json['difficulty'] ?? 'medium',
          durationHours: json['durationHours'] ?? 0,
          educator: json['educator'] ?? '',
          heroIcon: _getIconForSubject(json['subject']),
          progressPercent: json['progressPercent'] ?? 0,
          tags: List<String>.from(json['tags'] ?? []),
        )).toList();
      }
      return [];
    } catch (e) {
      print('Failed to fetch courses: $e');
      return [];
    }
  }

  static Future<List<LibraryBook>> getBooks() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/books'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final list = data['data'] as List;
        return list.map((json) => LibraryBook(
          id: json['id'],
          title: json['title'],
          author: json['author'],
          category: json['category'],
          subject: json['subject'],
          edition: json['edition'],
          summary: json['description'] ?? '',
          tags: List<String>.from(json['tags'] ?? []),
        )).toList();
      }
      return [];
    } catch (e) {
      print('Failed to fetch books: $e');
      return [];
    }
  }

  static Future<List<QuizSummary>> getQuizzes() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/quizzes'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final list = data['data'] as List;
        return list.map((json) => QuizSummary(
          id: json['id'],
          title: json['title'],
          description: json['description'] ?? '',
          subject: json['subject'] ?? '',
          examTrack: json['examTrack'] ?? 'MBBS',
          durationMinutes: json['durationMinutes'] ?? 20,
          totalQuestions: json['totalQuestions'] ?? 0,
          topicFocus: List<String>.from(json['topicFocus'] ?? []),
        )).toList();
      }
      return [];
    } catch (e) {
      print('Failed to fetch quizzes: $e');
      return [];
    }
  }

  static Future<List<QuizQuestion>> getQuizQuestions(String quizId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/quizzes/$quizId'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final list = (data['data']['questions'] ?? []) as List;
        return list.map((json) => QuizQuestion(
          id: json['id'],
          quizId: quizId,
          subject: json['subject'] ?? '',
          topic: json['topic'] ?? '',
          prompt: json['prompt'],
          explanation: json['explanation'] ?? '',
          correctOptionId: json['correctOptionId'],
          options: (json['options'] as List).map((o) => QuizOption(
            id: o['id'],
            label: o['label'],
            text: o['text'],
          )).toList(),
        )).toList();
      }
      return [];
    } catch (e) {
      print('Failed to fetch quiz questions: $e');
      return [];
    }
  }

  static Future<String?> sendAIMessage(String message, String? token) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/ai/chat'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'prompt': message}),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['data']['message']['content'] as String?;
      }
      return null;
    } catch (e) {
      print('AI chat failed: $e');
      return null;
    }
  }

  static IconData _getIconForSubject(String? subject) {
    switch (subject?.toLowerCase()) {
      case 'anatomy':      return Icons.accessibility_new_rounded;
      case 'physiology':   return Icons.monitor_heart_rounded;
      case 'biochemistry': return Icons.science_rounded;
      case 'medicine':     return Icons.medical_services_rounded;
      case 'pathology':    return Icons.biotech_rounded;
      case 'pharmacology': return Icons.medication_rounded;
      case 'microbiology': return Icons.coronavirus_rounded;
      case 'surgery':      return Icons.healing_rounded;
      default:             return Icons.import_contacts_rounded;
    }
  }
}
