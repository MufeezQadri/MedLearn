import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MedlearnColors {
  static const background = Color(0xFFF4F7F3);
  static const backgroundWarm = Color(0xFFF7F2EB);
  static const surface = Color(0xFFFFFFFF);
  static const surfaceLow = Color(0xFFF8FBF9);
  static const surfaceHigh = Color(0xFFE3ECE8);
  static const surfaceTint = Color(0xFFEFF5F2);
  static const primary = Color(0xFF0C6771);
  static const primaryDark = Color(0xFF0A3F47);
  static const primaryContainer = Color(0xFF15929F);
  static const primaryFixed = Color(0xFFCDEEF0);
  static const secondaryContainer = Color(0xFFE0F0E6);
  static const accent = Color(0xFFF18B4A);
  static const accentSoft = Color(0xFFF9E7D9);
  static const tertiary = Color(0xFF2B7E58);
  static const tertiarySoft = Color(0xFFE7F6EC);
  static const onSurface = Color(0xFF13232B);
  static const onSurfaceVariant = Color(0xFF5E6D75);
  static const outline = Color(0xFFD4DDD9);
  static const error = Color(0xFFC24E43);
  static const errorSoft = Color(0xFFFBE2DE);
  static const shadow = Color.fromRGBO(16, 35, 43, 0.08);
}

class MedLearnTheme {
  static ThemeData light() {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: MedlearnColors.primary,
      brightness: Brightness.light,
    ).copyWith(
      primary: MedlearnColors.primary,
      onPrimary: Colors.white,
      secondary: MedlearnColors.accent,
      secondaryContainer: MedlearnColors.secondaryContainer,
      surface: MedlearnColors.surface,
      onSurface: MedlearnColors.onSurface,
      error: MedlearnColors.error,
      outline: MedlearnColors.outline,
    );

    final base = ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      splashFactory: InkRipple.splashFactory,
    );

    final bodyText = GoogleFonts.plusJakartaSansTextTheme(base.textTheme);
    final displayText = GoogleFonts.soraTextTheme(bodyText);

    return base.copyWith(
      scaffoldBackgroundColor: MedlearnColors.background,
      textTheme: displayText.copyWith(
        bodyLarge: bodyText.bodyLarge?.copyWith(
          color: MedlearnColors.onSurface,
          fontSize: 16,
          fontWeight: FontWeight.w500,
          height: 1.55,
        ),
        bodyMedium: bodyText.bodyMedium?.copyWith(
          color: MedlearnColors.onSurface,
          fontSize: 14,
          fontWeight: FontWeight.w500,
          height: 1.5,
        ),
        bodySmall: bodyText.bodySmall?.copyWith(
          color: MedlearnColors.onSurfaceVariant,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
        titleLarge: GoogleFonts.sora(
          color: MedlearnColors.onSurface,
          fontSize: 24,
          fontWeight: FontWeight.w700,
          height: 1.1,
        ),
        titleMedium: GoogleFonts.sora(
          color: MedlearnColors.onSurface,
          fontSize: 18,
          fontWeight: FontWeight.w700,
          height: 1.2,
        ),
        headlineMedium: GoogleFonts.sora(
          color: MedlearnColors.onSurface,
          fontSize: 36,
          fontWeight: FontWeight.w700,
          height: 1.02,
        ),
        headlineSmall: GoogleFonts.sora(
          color: MedlearnColors.onSurface,
          fontSize: 30,
          fontWeight: FontWeight.w700,
          height: 1.08,
        ),
        labelLarge: GoogleFonts.plusJakartaSans(
          color: MedlearnColors.onSurface,
          fontSize: 13,
          fontWeight: FontWeight.w700,
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        foregroundColor: MedlearnColors.onSurface,
        titleTextStyle: GoogleFonts.sora(
          color: MedlearnColors.onSurface,
          fontSize: 22,
          fontWeight: FontWeight.w700,
        ),
      ),
      drawerTheme: const DrawerThemeData(
        backgroundColor: MedlearnColors.surface,
        surfaceTintColor: Colors.transparent,
      ),
      cardTheme: CardThemeData(
        color: MedlearnColors.surface,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30),
          side: const BorderSide(color: MedlearnColors.outline, width: 1),
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: Colors.white.withValues(alpha: 0.96),
        indicatorColor: MedlearnColors.primaryFixed,
        shadowColor: MedlearnColors.shadow,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        height: 78,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        iconTheme: WidgetStateProperty.resolveWith(
          (states) => IconThemeData(
            color: states.contains(WidgetState.selected)
                ? MedlearnColors.primary
                : MedlearnColors.onSurfaceVariant,
          ),
        ),
        labelTextStyle: WidgetStateProperty.resolveWith(
          (states) => GoogleFonts.plusJakartaSans(
            fontSize: 11,
            fontWeight: states.contains(WidgetState.selected) ? FontWeight.w800 : FontWeight.w600,
            color: states.contains(WidgetState.selected)
                ? MedlearnColors.primary
                : MedlearnColors.onSurfaceVariant,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: MedlearnColors.surface,
        hintStyle: GoogleFonts.plusJakartaSans(
          color: MedlearnColors.onSurfaceVariant,
          fontWeight: FontWeight.w500,
        ),
        labelStyle: GoogleFonts.plusJakartaSans(
          color: MedlearnColors.onSurfaceVariant,
          fontWeight: FontWeight.w600,
        ),
        prefixIconColor: MedlearnColors.onSurfaceVariant,
        suffixIconColor: MedlearnColors.onSurfaceVariant,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(24),
          borderSide: const BorderSide(color: MedlearnColors.outline),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(24),
          borderSide: const BorderSide(color: MedlearnColors.outline),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(24),
          borderSide: const BorderSide(color: MedlearnColors.primary, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: MedlearnColors.primary,
          foregroundColor: Colors.white,
          textStyle: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w800,
            fontSize: 15,
          ),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: MedlearnColors.onSurface,
          textStyle: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w800,
            fontSize: 15,
          ),
          side: const BorderSide(color: MedlearnColors.outline),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: MedlearnColors.primary,
          textStyle: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
      iconButtonTheme: IconButtonThemeData(
        style: IconButton.styleFrom(
          foregroundColor: MedlearnColors.onSurface,
          backgroundColor: MedlearnColors.surface,
          padding: const EdgeInsets.all(12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(18),
            side: const BorderSide(color: MedlearnColors.outline),
          ),
        ),
      ),
      chipTheme: base.chipTheme.copyWith(
        backgroundColor: MedlearnColors.surface,
        selectedColor: MedlearnColors.primary,
        labelStyle: GoogleFonts.plusJakartaSans(
          color: MedlearnColors.onSurfaceVariant,
          fontWeight: FontWeight.w700,
        ),
        secondaryLabelStyle: GoogleFonts.plusJakartaSans(
          color: Colors.white,
          fontWeight: FontWeight.w700,
        ),
        side: const BorderSide(color: MedlearnColors.outline),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: MedlearnColors.primary,
        linearTrackColor: MedlearnColors.surfaceHigh,
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: MedlearnColors.surface,
        surfaceTintColor: Colors.transparent,
        showDragHandle: true,
      ),
      dividerTheme: const DividerThemeData(
        color: MedlearnColors.outline,
        thickness: 1,
      ),
      listTileTheme: const ListTileThemeData(
        iconColor: MedlearnColors.onSurface,
        contentPadding: EdgeInsets.zero,
      ),
    );
  }
}
