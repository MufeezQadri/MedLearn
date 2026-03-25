import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../app/app_theme.dart';

class MedScaffoldBackground extends StatelessWidget {
  const MedScaffoldBackground({
    super.key,
    required this.child,
  });

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            MedlearnColors.backgroundWarm,
            MedlearnColors.background,
            Color(0xFFF0F6F3),
          ],
        ),
      ),
      child: Stack(
        children: [
          const Positioned(
            top: -90,
            right: -30,
            child: _GlowOrb(
              size: 220,
              color: MedlearnColors.primaryFixed,
            ),
          ),
          const Positioned(
            top: 210,
            left: -80,
            child: _GlowOrb(
              size: 180,
              color: MedlearnColors.accentSoft,
            ),
          ),
          const Positioned(
            bottom: -100,
            right: -40,
            child: _GlowOrb(
              size: 210,
              color: MedlearnColors.secondaryContainer,
            ),
          ),
          child,
        ],
      ),
    );
  }
}

class EditorialCard extends StatelessWidget {
  const EditorialCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
    this.color = MedlearnColors.surface,
    this.gradient,
    this.borderColor = MedlearnColors.outline,
    this.radius = 30,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final Color color;
  final Gradient? gradient;
  final Color borderColor;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: gradient == null ? color : null,
        gradient: gradient,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: borderColor),
        boxShadow: const [
          BoxShadow(
            color: MedlearnColors.shadow,
            blurRadius: 30,
            offset: Offset(0, 16),
          ),
        ],
      ),
      child: child,
    );
  }
}

class GlassCard extends StatelessWidget {
  const GlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(18),
  });

  final Widget child;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withValues(alpha: 0.92),
            Colors.white.withValues(alpha: 0.72),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(26),
        border: Border.all(color: Colors.white.withValues(alpha: 0.65)),
        boxShadow: const [
          BoxShadow(
            color: Color.fromRGBO(17, 32, 43, 0.06),
            blurRadius: 22,
            offset: Offset(0, 10),
          ),
        ],
      ),
      child: child,
    );
  }
}

class SectionHeader extends StatelessWidget {
  const SectionHeader({
    super.key,
    required this.eyebrow,
    required this.title,
    this.action,
  });

  final String eyebrow;
  final String title;
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                eyebrow.toUpperCase(),
                style: GoogleFonts.plusJakartaSans(
                  color: MedlearnColors.primary,
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 2.3,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                title,
                style: Theme.of(context).textTheme.headlineSmall,
              ),
            ],
          ),
        ),
        if (action != null) action!,
      ],
    );
  }
}

class MetricTile extends StatelessWidget {
  const MetricTile({
    super.key,
    required this.label,
    required this.value,
    required this.icon,
    this.meta,
  });

  final String label;
  final String value;
  final IconData icon;
  final String? meta;

  @override
  Widget build(BuildContext context) {
    return EditorialCard(
      padding: const EdgeInsets.all(18),
      color: MedlearnColors.surface,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                height: 42,
                width: 42,
                decoration: BoxDecoration(
                  color: MedlearnColors.surfaceTint,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(icon, color: MedlearnColors.primary),
              ),
              const Spacer(),
              Container(
                height: 10,
                width: 10,
                decoration: const BoxDecoration(
                  color: MedlearnColors.tertiary,
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          Text(
            value,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontSize: 28),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
          ),
          if (meta != null) ...[
            const SizedBox(height: 8),
            Text(
              meta!,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(color: MedlearnColors.primary),
            ),
          ],
        ],
      ),
    );
  }
}

class TagChip extends StatelessWidget {
  const TagChip({
    super.key,
    required this.label,
    this.selected = false,
    this.padding = const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
    this.icon,
    this.backgroundColor,
    this.foregroundColor,
  });

  final String label;
  final bool selected;
  final EdgeInsetsGeometry padding;
  final IconData? icon;
  final Color? backgroundColor;
  final Color? foregroundColor;

  @override
  Widget build(BuildContext context) {
    final background = backgroundColor ??
        (selected ? MedlearnColors.primary : Colors.white.withValues(alpha: 0.86));
    final foreground = foregroundColor ??
        (selected ? Colors.white : MedlearnColors.onSurfaceVariant);

    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(
          color: selected ? Colors.transparent : MedlearnColors.outline,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 14, color: foreground),
            const SizedBox(width: 6),
          ],
          Text(
            label,
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  color: foreground,
                  fontWeight: FontWeight.w700,
                ),
          ),
        ],
      ),
    );
  }
}

class ScoreRing extends StatelessWidget {
  const ScoreRing({
    super.key,
    required this.score,
    this.size = 176,
    this.textColor = MedlearnColors.onSurface,
    this.subtextColor = MedlearnColors.onSurfaceVariant,
    this.trackColor = MedlearnColors.surfaceHigh,
  });

  final int score;
  final double size;
  final Color textColor;
  final Color subtextColor;
  final Color trackColor;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _ScorePainter(score: score, trackColor: trackColor),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                '$score',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontSize: size * 0.24,
                      color: textColor,
                    ),
              ),
              Text(
                '/ 100',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: subtextColor),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class MiniBarChart extends StatelessWidget {
  const MiniBarChart({
    super.key,
    required this.values,
  });

  final List<double> values;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 90,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: values
            .map(
              (value) => Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: Container(
                    height: value,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.bottomCenter,
                        end: Alignment.topCenter,
                        colors: value == values.reduce(math.max)
                            ? [
                                MedlearnColors.primary,
                                MedlearnColors.primaryContainer,
                              ]
                            : [
                                MedlearnColors.primary.withValues(alpha: 0.18),
                                MedlearnColors.primary.withValues(alpha: 0.42),
                              ],
                      ),
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                    ),
                  ),
                ),
              ),
            )
            .toList(),
      ),
    );
  }
}

class EmptyStateCard extends StatelessWidget {
  const EmptyStateCard({
    super.key,
    required this.title,
    required this.message,
    required this.icon,
  });

  final String title;
  final String message;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return EditorialCard(
      padding: const EdgeInsets.all(22),
      color: MedlearnColors.surfaceLow,
      child: Column(
        children: [
          Container(
            height: 56,
            width: 56,
            decoration: BoxDecoration(
              color: MedlearnColors.surface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(icon, size: 28, color: MedlearnColors.primary),
          ),
          const SizedBox(height: 14),
          Text(title, style: Theme.of(context).textTheme.titleMedium, textAlign: TextAlign.center),
          const SizedBox(height: 8),
          Text(
            message,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _GlowOrb extends StatelessWidget {
  const _GlowOrb({
    required this.size,
    required this.color,
  });

  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Container(
        height: size,
        width: size,
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.75),
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.55),
              blurRadius: 70,
              spreadRadius: 8,
            ),
          ],
        ),
      ),
    );
  }
}

class _ScorePainter extends CustomPainter {
  _ScorePainter({
    required this.score,
    required this.trackColor,
  });

  final int score;
  final Color trackColor;

  @override
  void paint(Canvas canvas, Size size) {
    const stroke = 14.0;
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - stroke) / 2;

    final basePaint = Paint()
      ..color = trackColor
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = stroke;

    final progressPaint = Paint()
      ..shader = const SweepGradient(
        colors: [
          MedlearnColors.primary,
          MedlearnColors.primaryContainer,
          MedlearnColors.accent,
        ],
        stops: [0.0, 0.7, 1.0],
      ).createShader(Rect.fromCircle(center: center, radius: radius))
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = stroke;

    canvas.drawCircle(center, radius, basePaint);
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2,
      2 * math.pi * (score / 100),
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _ScorePainter oldDelegate) {
    return oldDelegate.score != score || oldDelegate.trackColor != trackColor;
  }
}
