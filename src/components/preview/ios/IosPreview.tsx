import {
    Apple,
    Check,
    ChevronRight,
    Compass,
    Heart,
    Search,
    Settings,
    Share2,
    Sliders,
    Sparkles,
    Star,
    Sun,
    Wifi,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { usePalette } from '../../../context/PaletteContext';
import { getRecommendedTextColor, getRelativeLuminance } from '../../../core/color';
import { ExportIosModal } from '../../palette/ExportIosModal';

export interface IosPreviewProps {
  isFocused?: boolean;
}

export type IosTab = 'featured' | 'search' | 'settings';
export type IosSegment = 'Featured' | 'Top Charts' | 'Categories';

export const IosPreview: React.FC<IosPreviewProps> = ({ isFocused = false }) => {
  const { colors } = usePalette();

  // Navigation & Modal states
  const [activeTab, setActiveTab] = useState<IosTab>('featured');
  const [activeSegment, setActiveSegment] = useState<IosSegment>('Featured');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Screen 1: Featured states
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(128);

  // Screen 2: Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('Design Systems');

  // Screen 3: Settings states
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [trueTone, setTrueTone] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [brightness, setBrightness] = useState(72);

  // Derive iOS appearance mode automatically from palette background luminance
  const isDark = getRelativeLuminance(colors.background) < 0.5;

  // Semantic Tokens
  const systemTint = colors.primary;
  const primaryOnTint = getRecommendedTextColor(colors.primary);
  const systemAccent = colors.accent;
  const accentOnAccent = getRecommendedTextColor(colors.accent);
  const labelColor = colors.text;
  const secondaryLabelColor = isDark ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)';
  const tertiaryLabelColor = isDark ? 'rgba(235, 235, 245, 0.35)' : 'rgba(60, 60, 67, 0.35)';

  // Elevated card & grouped backgrounds
  const secondaryBg = isDark ? '#1c1c1e' : '#f2f2f7';
  const tertiaryBg = isDark ? '#2c2c2e' : '#ffffff';
  const separatorColor = isDark ? 'rgba(84, 84, 88, 0.4)' : 'rgba(60, 60, 67, 0.15)';
  const navBarBg = isDark ? 'rgba(28, 28, 30, 0.82)' : 'rgba(242, 242, 247, 0.82)';
  const tabBarBg = isDark ? 'rgba(28, 28, 30, 0.88)' : 'rgba(249, 249, 249, 0.88)';

  const handleToggleLike = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const searchTags = ['Design Systems', 'Cupertino', 'SF Symbols', 'SwiftUI'];

  return (
    <div
      data-testid="ios-preview-container"
      className="flex flex-col items-center justify-center p-2 sm:p-4 transition-colors"
    >
      {/* Top Controls: Mode Badge & Quick Export */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between gap-2 px-1">
        {/* iOS Appearance Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Appearance:
          </span>
          <span
            data-testid="ios-appearance-badge"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <Apple className="w-3 h-3 text-slate-700 dark:text-slate-300" />
            <span>{isDark ? 'iOS 18 Dark' : 'iOS 18 Light'}</span>
          </span>
        </div>

        {/* Quick Export Button */}
        <button
          type="button"
          data-testid="ios-quick-export-button"
          onClick={() => setIsExportModalOpen(true)}
          aria-label="Export iOS Swift and xcassets resources"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <Apple className="w-3.5 h-3.5" />
          <span>Export Swift</span>
        </button>
      </div>

      {/* iPhone Smartphone Chassis Frame */}
      <div
        data-testid="ios-phone-chassis"
        className={`relative w-full ${
          isFocused ? 'max-w-[380px] h-[680px]' : 'max-w-[340px] h-[640px]'
        } rounded-[3rem] border-[6px] border-slate-800 dark:border-slate-700 bg-slate-950 shadow-2xl overflow-hidden flex flex-col transition-all ring-1 ring-black/30 select-none`}
        style={{ backgroundColor: colors.background }}
      >
        {/* Status Bar with Dynamic Island */}
        <div
          data-testid="ios-status-bar"
          className="relative h-11 px-6 flex items-center justify-between z-30 transition-colors"
          style={{ color: labelColor }}
        >
          {/* Time (SF Pro style) */}
          <span className="text-xs font-semibold tracking-tight">9:41</span>

          {/* Centered Apple Dynamic Island */}
          <div
            data-testid="ios-dynamic-island"
            className="w-24 h-6 rounded-full bg-black mx-auto flex items-center justify-between px-2.5 shadow-xs border border-white/5 pointer-events-none"
          >
            {/* Camera Lens */}
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-indigo-950/80" />
            </div>
            {/* Ambient Sensor */}
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>

          {/* Cellular, Wi-Fi & Battery Status Icons */}
          <div className="flex items-center gap-1.5 text-xs">
            {/* 4-bar cellular indicator */}
            <div
              data-testid="ios-cellular-signal"
              aria-label="Cellular signal full"
              className="flex items-end gap-0.5 h-2.5"
            >
              <div className="w-0.5 h-1 rounded-full bg-current" />
              <div className="w-0.5 h-1.5 rounded-full bg-current" />
              <div className="w-0.5 h-2 rounded-full bg-current" />
              <div className="w-0.5 h-2.5 rounded-full bg-current" />
            </div>

            <Wifi className="w-3 h-3" />

            {/* Battery Pill */}
            <div
              data-testid="ios-battery"
              aria-label="Battery 100 percent"
              className="flex items-center"
            >
              <div className="w-5 h-2.5 rounded-sm border border-current p-0.5 flex items-center">
                <div className="w-full h-full rounded-2xs bg-current" />
              </div>
              <div className="w-0.5 h-1 rounded-r-xs bg-current -ml-px" />
            </div>
          </div>
        </div>

        {/* Dynamic Frosted Top Navigation Bar */}
        <div
          data-testid="ios-navbar"
          className="px-4 pt-1 pb-2.5 backdrop-blur-md border-b z-20 transition-all flex flex-col gap-1.5"
          style={{
            backgroundColor: navBarBg,
            borderColor: separatorColor,
            color: labelColor,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                {activeTab === 'featured'
                  ? 'TUESDAY, SEPTEMBER 9'
                  : activeTab === 'search'
                  ? 'EXPLORE'
                  : 'PREFERENCES'}
              </span>
              <h1 className="text-xl font-extrabold tracking-tight leading-tight">
                {activeTab === 'featured'
                  ? 'Featured'
                  : activeTab === 'search'
                  ? 'Search'
                  : 'Settings'}
              </h1>
            </div>

            {/* Profile Avatar button */}
            <button
              type="button"
              aria-label="User Profile"
              className="w-8 h-8 rounded-full border shadow-2xs flex items-center justify-center font-bold text-xs cursor-pointer transition-transform active:scale-95"
              style={{
                backgroundColor: systemAccent,
                color: accentOnAccent,
                borderColor: separatorColor,
              }}
            >
              TT
            </button>
          </div>

          {/* Segmented Control on Featured View */}
          {activeTab === 'featured' && (
            <div
              data-testid="ios-segmented-control"
              className="mt-1 flex items-center p-0.5 rounded-xl border"
              style={{
                backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)',
                borderColor: separatorColor,
              }}
            >
              {(['Featured', 'Top Charts', 'Categories'] as IosSegment[]).map((seg) => {
                const isActive = activeSegment === seg;
                return (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => setActiveSegment(seg)}
                    aria-pressed={isActive}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      isActive ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isActive ? tertiaryBg : 'transparent',
                      color: isActive ? labelColor : secondaryLabelColor,
                    }}
                  >
                    {seg}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Scrollable Screen Content Canvas */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* ================= Screen 1: Featured View ================= */}
          {activeTab === 'featured' && (
            <div className="space-y-4">
              {/* Highlight Hero Card */}
              <div
                data-testid="ios-hero-card"
                className="rounded-2xl border p-4 shadow-sm transition-all relative overflow-hidden"
                style={{
                  backgroundColor: secondaryBg,
                  borderColor: separatorColor,
                  color: labelColor,
                }}
              >
                {/* Category & Status */}
                <div className="flex items-center justify-between text-[11px] font-semibold mb-2">
                  <span
                    className="uppercase tracking-wide font-bold"
                    style={{ color: systemTint }}
                  >
                    MAJOR UPDATE
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[11px] font-bold">4.9</span>
                  </div>
                </div>

                {/* Hero App Row */}
                <div className="flex items-start gap-3 mb-3">
                  {/* App Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl shadow-md flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: systemTint,
                      color: primaryOnTint,
                    }}
                  >
                    <Sparkles className="w-7 h-7" />
                  </div>

                  {/* App Details */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold tracking-tight truncate">
                      ThemeStudio Pro
                    </h2>
                    <p
                      className="text-xs truncate"
                      style={{ color: secondaryLabelColor }}
                    >
                      Multi-Platform Design Kit
                    </p>
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: tertiaryLabelColor }}
                    >
                      In-App Purchases
                    </span>
                  </div>

                  {/* Cupertino GET Button */}
                  <button
                    type="button"
                    data-testid="ios-get-button"
                    onClick={() => setIsPurchased(!isPurchased)}
                    aria-label={isPurchased ? 'Open application' : 'Get application'}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-transform active:scale-95 cursor-pointer shadow-2xs"
                    style={{
                      backgroundColor: isPurchased
                        ? isDark
                          ? '#3a3a3c'
                          : '#e5e5ea'
                        : systemTint,
                      color: isPurchased ? labelColor : primaryOnTint,
                    }}
                  >
                    {isPurchased ? 'OPEN' : 'GET'}
                  </button>
                </div>

                {/* Micro Preview Swatch Palette Inside Card */}
                <div
                  className="rounded-xl p-2.5 border mb-3 flex items-center justify-between"
                  style={{
                    backgroundColor: tertiaryBg,
                    borderColor: separatorColor,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: colors.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: colors.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: colors.accent }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-mono font-medium"
                    style={{ color: secondaryLabelColor }}
                  >
                    Dynamic UIKit Token Sync
                  </span>
                </div>

                {/* Action Row */}
                <div
                  className="flex items-center justify-between pt-2 border-t text-xs font-semibold"
                  style={{ borderColor: separatorColor }}
                >
                  <button
                    type="button"
                    onClick={handleToggleLike}
                    className="flex items-center gap-1.5 transition-colors cursor-pointer"
                    style={{ color: isLiked ? '#ef4444' : secondaryLabelColor }}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`}
                    />
                    <span>{likeCount} Likes</span>
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1 transition-colors cursor-pointer"
                    style={{ color: secondaryLabelColor }}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Secondary Spotlight App Item */}
              <div
                className="rounded-2xl border p-3 flex items-center justify-between"
                style={{
                  backgroundColor: secondaryBg,
                  borderColor: separatorColor,
                  color: labelColor,
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl shadow-xs flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: systemAccent,
                      color: accentOnAccent,
                    }}
                  >
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold truncate">SF Color Atlas</h3>
                    <p
                      className="text-[11px] truncate"
                      style={{ color: secondaryLabelColor }}
                    >
                      Semantic contrast explorer
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-transform active:scale-95"
                  style={{
                    backgroundColor: isDark ? '#3a3a3c' : '#e5e5ea',
                    color: systemTint,
                  }}
                >
                  OPEN
                </button>
              </div>
            </div>
          )}

          {/* ================= Screen 2: Search View ================= */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              {/* Cupertino Search Bar */}
              <div
                data-testid="ios-search-bar"
                className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all"
                style={{
                  backgroundColor: tertiaryBg,
                  borderColor: separatorColor,
                  color: labelColor,
                }}
              >
                <Search
                  className="w-4 h-4 shrink-0"
                  style={{ color: secondaryLabelColor }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Apps, Games, Stories and More"
                  aria-label="Search iOS App Store"
                  className="w-full text-xs bg-transparent outline-none placeholder:opacity-50"
                  style={{ color: labelColor }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="p-0.5 rounded-full hover:opacity-80 cursor-pointer"
                    style={{ color: secondaryLabelColor }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Suggested Discovery Tags */}
              <div className="space-y-2">
                <span
                  className="text-xs font-bold"
                  style={{ color: labelColor }}
                >
                  Discover
                </span>
                <div className="flex flex-wrap gap-2">
                  {searchTags.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                          isSelected ? 'shadow-xs font-semibold' : ''
                        }`}
                        style={{
                          backgroundColor: isSelected ? systemTint : secondaryBg,
                          color: isSelected ? primaryOnTint : labelColor,
                          borderColor: isSelected ? systemTint : separatorColor,
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sample Search Result Tile */}
              <div
                className="p-3.5 rounded-2xl border space-y-1"
                style={{
                  backgroundColor: secondaryBg,
                  borderColor: separatorColor,
                  color: labelColor,
                }}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Active Query Scope</span>
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: systemTint }}
                  >
                    {selectedTag}
                  </span>
                </div>
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: secondaryLabelColor }}
                >
                  Adaptive dynamic typing with San Francisco typography and Cupertino HIG guidelines.
                </p>
              </div>
            </div>
          )}

          {/* ================= Screen 3: Settings View ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Grouped Inset Section 1: Visual Experience */}
              <div className="space-y-1">
                <div
                  className="text-[11px] uppercase font-semibold px-2"
                  style={{ color: secondaryLabelColor }}
                >
                  Theme & Appearance
                </div>
                <div
                  data-testid="ios-settings-group-1"
                  className="rounded-2xl border overflow-hidden divide-y"
                  style={{
                    backgroundColor: secondaryBg,
                    borderColor: separatorColor,
                    // divideColor: separatorColor,
                  }}
                >
                  {/* Row 1: Haptic Feedback Switch */}
                  <div
                    className="p-3 flex items-center justify-between"
                    style={{ borderColor: separatorColor }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: systemTint,
                          color: primaryOnTint,
                        }}
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-medium" style={{ color: labelColor }}>
                        Haptic Feedback
                      </span>
                    </div>

                    {/* Cupertino Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={hapticFeedback}
                      data-testid="ios-switch-haptics"
                      onClick={() => setHapticFeedback(!hapticFeedback)}
                      aria-label="Toggle haptic feedback"
                      className="w-11 h-6 rounded-full p-0.5 transition-colors relative cursor-pointer"
                      style={{
                        backgroundColor: hapticFeedback
                          ? systemTint
                          : isDark
                          ? '#39393d'
                          : '#e9e9ea',
                      }}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                          hapticFeedback ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Row 2: True Tone Switch */}
                  <div
                    className="p-3 flex items-center justify-between"
                    style={{ borderColor: separatorColor }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: systemAccent,
                          color: accentOnAccent,
                        }}
                      >
                        <Sun className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-medium" style={{ color: labelColor }}>
                        True Tone Display
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={trueTone}
                      data-testid="ios-switch-truetone"
                      onClick={() => setTrueTone(!trueTone)}
                      aria-label="Toggle true tone"
                      className="w-11 h-6 rounded-full p-0.5 transition-colors relative cursor-pointer"
                      style={{
                        backgroundColor: trueTone
                          ? systemTint
                          : isDark
                          ? '#39393d'
                          : '#e9e9ea',
                      }}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                          trueTone ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Row 3: Push Notifications */}
                  <div
                    className="p-3 flex items-center justify-between"
                    style={{ borderColor: separatorColor }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-rose-500 text-white">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-medium" style={{ color: labelColor }}>
                        Push Alerts
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications}
                      data-testid="ios-switch-notifications"
                      onClick={() => setNotifications(!notifications)}
                      aria-label="Toggle push notifications"
                      className="w-11 h-6 rounded-full p-0.5 transition-colors relative cursor-pointer"
                      style={{
                        backgroundColor: notifications
                          ? systemTint
                          : isDark
                          ? '#39393d'
                          : '#e9e9ea',
                      }}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                          notifications ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grouped Inset Section 2: Display Slider */}
              <div className="space-y-1">
                <div
                  className="text-[11px] uppercase font-semibold px-2"
                  style={{ color: secondaryLabelColor }}
                >
                  Display Brightness
                </div>
                <div
                  className="rounded-2xl border p-3 space-y-2"
                  style={{
                    backgroundColor: secondaryBg,
                    borderColor: separatorColor,
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <Sun
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: secondaryLabelColor }}
                    />
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      data-testid="ios-slider"
                      aria-label="Brightness Slider"
                      className="w-full accent-indigo-500 h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-300 dark:bg-slate-700"
                      style={{ accentColor: systemTint }}
                    />
                    <Sun
                      className="w-4 h-4 shrink-0"
                      style={{ color: systemTint }}
                    />
                  </div>
                  <div
                    className="text-right text-[10px] font-mono font-semibold"
                    style={{ color: secondaryLabelColor }}
                  >
                    {brightness}%
                  </div>
                </div>
              </div>

              {/* Grouped Inset Section 3: System Disclosure Item */}
              <div
                className="rounded-2xl border p-3 flex items-center justify-between"
                style={{
                  backgroundColor: secondaryBg,
                  borderColor: separatorColor,
                  color: labelColor,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-500 text-white flex items-center justify-center">
                    <Settings className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium">About ThemeTool iOS</span>
                    <p
                      className="text-[10px]"
                      style={{ color: secondaryLabelColor }}
                    >
                      v1.4.0 (Build 42)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1" style={{ color: secondaryLabelColor }}>
                  <span className="text-xs font-medium">Synced</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Translucent Frosted Bottom Tab Bar */}
        <div
          data-testid="ios-tab-bar"
          className="pt-1.5 pb-1 px-6 backdrop-blur-md border-t z-30 transition-all flex flex-col items-center justify-between"
          style={{
            backgroundColor: tabBarBg,
            borderColor: separatorColor,
          }}
        >
          {/* Tab buttons */}
          <div className="w-full flex items-center justify-around">
            {/* Tab 1: Featured */}
            <button
              type="button"
              data-testid="ios-tab-featured"
              onClick={() => setActiveTab('featured')}
              aria-label="Featured Tab"
              aria-selected={activeTab === 'featured'}
              className="flex flex-col items-center gap-0.5 transition-transform active:scale-95 cursor-pointer"
              style={{
                color: activeTab === 'featured' ? systemTint : secondaryLabelColor,
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-semibold">Featured</span>
            </button>

            {/* Tab 2: Search */}
            <button
              type="button"
              data-testid="ios-tab-search"
              onClick={() => setActiveTab('search')}
              aria-label="Search Tab"
              aria-selected={activeTab === 'search'}
              className="flex flex-col items-center gap-0.5 transition-transform active:scale-95 cursor-pointer"
              style={{
                color: activeTab === 'search' ? systemTint : secondaryLabelColor,
              }}
            >
              <Search className="w-4 h-4" />
              <span className="text-[10px] font-semibold">Search</span>
            </button>

            {/* Tab 3: Settings */}
            <button
              type="button"
              data-testid="ios-tab-settings"
              onClick={() => setActiveTab('settings')}
              aria-label="Settings Tab"
              aria-selected={activeTab === 'settings'}
              className="flex flex-col items-center gap-0.5 transition-transform active:scale-95 cursor-pointer"
              style={{
                color: activeTab === 'settings' ? systemTint : secondaryLabelColor,
              }}
            >
              <Settings className="w-4 h-4" />
              <span className="text-[10px] font-semibold">Settings</span>
            </button>
          </div>

          {/* Bottom Apple Home Indicator Bar */}
          <div
            data-testid="ios-home-indicator"
            className="w-28 h-1 rounded-full mt-2 transition-colors"
            style={{
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.45)'
                : 'rgba(0, 0, 0, 0.35)',
            }}
          />
        </div>
      </div>

      {/* Export iOS Modal */}
      <ExportIosModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};
