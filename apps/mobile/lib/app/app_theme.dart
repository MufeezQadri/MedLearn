import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MedlearnColors {
  static const background = Color(0xFFFFFFFF);
  static const backgroundWarm = Color(0xFFFAFAFA);
  static const surface = Color(0xFFFFFFFF);
  static const surfaceLow = Color(0xFFF5F5F5);
  static const surfaceHigh = Color(0xFFEBEBEB);
  static const surfaceTint = Color(0xFFF5F5F5);
  static const primary = Color(0xFF111111);
  static const primaryDark = Color(0xFF000000);
  static const primaryContainer = Color(0xFF333333);
  static const primaryFixed = Color(0xFFE5E5E5);
  static const secondaryContainer = Color(0xFFF5F5F5);
  static const accent = Color(0xFF111111);
  static const accentSoft = Color(0xFFF0F0F0);
  static const tertiary = Color(0xFF555555);
  static const tertiarySoft = Color(0xFFF5F5F5);
  static const onSurface = Color(0xFF111111);
  static const onSurfaceVariant = Color(0xFF666666);
  static const outline = Color(0xFFE5E5E5);
  static const error = Color(0xFFD32F2F);
  static const errorSoft = Color(0xFFFFEBEE);
  static const shadow = Color.fromRGBO(0, 0, 0, 0.04);
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
          borderRadius: BorderRadius.circular(16),
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
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: MedlearnColors.outline),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: MedlearnColors.outline),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
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
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
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
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
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
            borderRadius: BorderRadius.circular(12),
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
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
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
