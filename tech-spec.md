# Fashionxpression — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| gsap | ^3.12 | Core animation engine — timelines, tweens, ScrollTrigger (scroll-driven), SplitText (character text reveals), Flip (layout transitions) |
| lenis | ^1.0 | Smooth scroll with inertia |
| imagesloaded | ^5.0 | Image preloading for masonry layout calculations |

Fonts (Google Fonts): Playfair Display (400,500,600), Inter (400,500,600), Cormorant Garamond (400 italic).

No framework. No build tool. Vanilla JS with ES6 modules, directly in browser via `type="module"`. This is a static multi-page site with shared components and page-specific modules.

---

## Component Inventory

### Shared Components (used across multiple pages)

| Component | Used On | Notes |
|-----------|---------|-------|
| Navigation | All 7 pages | Sticky glassmorphism nav, mobile hamburger overlay, search overlay, active page underline. Logo color switches based on section contrast. |
| Footer | All 7 pages except where noted otherwise | 4-column grid, newsletter signup with success state, bottom bar. |
| WhatsApp Float | All 7 pages | Fixed button with pulse animation, tooltip, pre-filled message link. |
| Custom Cursor | All 7 pages | Desktop only (<1024px hidden). Lerp-following dot that expands on interactables. |
| Page Loader | All 7 pages | Full-screen SVG stroke-draw + text stagger, 2.5s minimum. |
| TextReveal | Home, Collection, Fabrics, Bespoke, Measurements, Lookbook, Journal | GSAP SplitText char/word stagger. Used for hero headlines and section titles. |
| FadeEntrance | All 7 pages | Default scroll-triggered entrance (fade-up, fade-scale, slide-left/right). Applied to virtually every content element. |
| Parallax | Home, Collection, Fabrics, Lookbook | GSAP ScrollTrigger scrubbed translateY at varying speeds. |
| TestimonialCarousel | Home | Auto-rotating (6s), fade+scale transition, dot + arrow nav, pause on hover. |
| BookingCalendar | Bespoke, Measurements | Month grid, date/time selection, month slide transition, availability logic. |
| FAQAccordion | Bespoke | Expand/collapse with height animation, single-open, chevron rotation. |
| MasonryGrid | Collection, Lookbook | CSS columns + imagesloaded init. Filter support via GSAP Flip. |
| Lightbox | Lookbook | Full-screen image viewer, keyboard/swipe nav, scale-from-origin open. |
| HorizontalDragScroll | Home (Fabric Showcase), Lookbook (Behind the Scenes) | Drag with momentum, hidden scrollbar, grab cursor. |
| TextureMagnifier | Home (Fabric Showcase), Fabrics | Circular zoom lens following cursor, background-position technique. |
| Card3DTilt | Home (Collection Categories) | Mousemove-driven rotateX/Y (max ±8°), lift + shadow on hover, spring return. |
| AnimatedTimeline | Home | Vertical line with scroll-scrubbed fill, alternating left/right steps, sequential entrance. |
| InteractiveBodyDiagram | Measurements | SVG with 6 clickable points, dynamic sidebar, measurement checklist, pulse animation on active point. |

### Page Sections (single-use, page-specific)

**Home:** HeroSlider, FeaturedProducts, CtaBanner
**Collection:** CollectionHero, ProductGrid, Pagination
**Fabrics:** FabricHero, FabricCards, CustomFabricCTA
**Bespoke:** BespokeHero, ProcessSteps
**Measurements:** MeasurementHero, VideoGuide, BookFitting
**Lookbook:** LookbookHero, Gallery, BehindTheScenes
**Journal:** JournalHero, FeaturedArticle, ArticleGrid, NewsletterCTA

---

## Animation Implementation

| Animation | Library | Approach | Complexity |
|-----------|---------|----------|------------|
| Hero Cinematic Slider | Vanilla JS + GSAP | setInterval-driven slide index cycling. GSAP crossfade opacity between slides (1.2s). Ken Burns via CSS animation (scale 1→1.06 over 5s). Text staggered fade-in per slide change. | Medium |
| Text Reveal (chars/words) | GSAP + SplitText | SplitText splits into chars/words. Each starts at translateY(120%), opacity 0. GSAP stagger tween (0.03s/char, back.out(1.7)). Triggered on load (hero) or scroll enter (sections). | Medium |
| Scroll-Triggered Entrance | GSAP + ScrollTrigger | ScrollTrigger with start: "top 85%". Fade-up: opacity+translateY. Fade-scale: opacity+scale. Slide: opacity+translateX. Stagger groups via stagger property. Batch registration for grids. | Low |
| Parallax System | GSAP + ScrollTrigger | scrub: true ScrollTriggers. Background elements at 0.3x, foreground at 1.2x, cards at staggered speeds. Continuous translateY bound to scroll progress. | Medium |
| 3D Card Tilt | Vanilla JS | mousemove listener computes cursor position relative to card center. Maps to rotateX/Y (max ±8°) via CSS transform. mouseleave triggers spring-return GSAP tween. Also handles lift + shadow. | Medium |
| Horizontal Drag Scroll | Vanilla JS | mousedown/touchstart → mousemove/touchmove tracking. scrollLeft adjusted by drag delta. RequestAnimationFrame momentum loop (velocity × 0.95/frame after release). | Medium |
| Texture Magnifier | Vanilla JS | mousemove within fabric image. Lens div positioned at cursor, background-image same as fabric, background-size 200%, background-position dynamically calculated from offset. Show/hide on mouseenter/leave. | Low |
| Animated Timeline | GSAP + ScrollTrigger | Vertical connecting line: scaleY(0→1) scrubbed to scroll. Each step: individual ScrollTrigger for fade+slide entrance. Step number: scale(0.5→1) with back.out(1.7). Alternating left/right via CSS. | Medium |
| Testimonial Carousel | Vanilla JS + GSAP | setInterval 6s auto-advance. GSAP crossfade (opacity+scale) between slides. Pause on mouseenter. Dot/arrows update active index. | Low |
| Booking Calendar | Vanilla JS | Date grid computed from JS Date (first day of month, days in month). Month nav updates state, re-renders grid with slide-out/slide-in CSS transition. Date/time selection stored in state. Availability from mock data. | Medium |
| Masonry Grid | CSS columns + imagesloaded | column-count: 4 (desktop), 2 (mobile). imagesloaded callback triggers layout + entrance animations. | Low |
| Masonry Filter (Flip) | GSAP Flip | Flip.getState() before filter, Flip.to() after. Animates position changes of retained items, fade out removed, fade in added. | Medium |
| Lightbox | Vanilla JS + GSAP | GSAP fade-in overlay. Image position computed from getBoundingClientRect() of clicked image → center of viewport. Keyboard (Esc/Arrows) and touch swipe handlers. | Medium |
| Interactive Body Diagram | Vanilla JS + GSAP | 6 SVG circle elements with click handlers. Click updates sidebar innerHTML with fade transition (GSAP opacity tween 0.2s). Checklist checkboxes update completion state. Pulse: CSS keyframe on active circle. | Medium |
| Page Loader | GSAP | Timeline: SVG stroke-dasharray draw (1.5s) → SplitText char stagger (0.05s) → overlay slide-up (0.8s, back easing). Minimum 2.5s enforced with setTimeout. | Medium |
| Custom Cursor | Vanilla JS | rAF loop with lerp (0.15 factor) following mouse position. mouseenter/mouseleave on [data-cursor] elements toggle expanded state. mix-blend-mode: difference. Hidden below 1024px. | Low |
| Glassmorphism Nav | Vanilla JS + CSS | scroll event listener (>100px) toggles class. CSS handles backdrop-filter, gradient bg, shadow, height transition. Logo/text color switch via CSS variables. | Low |
| FAQ Accordion | Vanilla JS + GSAP | Click toggles answer height (0→scrollHeight, 0.4s). Chevron GSAP rotation (0→180deg). Auto-close others by collapsing their height to 0. | Low |
| WhatsApp Pulse | CSS | Pure CSS keyframe — ring div scale(1→1.5) + opacity(0→0.3), 4s infinite. | Low |
| Loading Skeletons | CSS | Shimmer overlay with translating linear-gradient (1.5s infinite). Replaced by content via opacity crossfade (0.3s). | Low |
| Smooth Scrolling | Lenis | Initialized once globally. Lenis scroll events call ScrollTrigger.update. All scroll-driven animations synced via scroller proxy. | Low |
| Product Card Hover | CSS | transform scale(1.03) on image, overlay opacity transition. Pure CSS. | Low |
| Play Button Pulse | CSS | Keyframe scale(1→1.05→1), 2s infinite. | Low |
| Scroll Indicator Bounce | CSS | Keyframe translateY oscillation, 2s infinite ease-in-out. | Low |

---

## State & Logic Plan

### Booking Calendar State Machine

The calendar is the most complex stateful component. States:

- **Month view** (default): Shows grid for current month. Prev/next arrows cycle months. Available dates have blue dot indicator. Unavailable/past dates are disabled.
- **Date selected**: Clicked date highlights (Royal Purple bg). Time slot buttons appear below.
- **Time selected**: Slot highlights. Booking buttons become active (opacity 1, clickable).
- **Booked**: Show confirmation overlay. Reset to month view after 3s.

Key decisions: Month navigation triggers grid re-render with CSS slide transition (not full re-render — translateX current grid out, new grid in). Availability data is a mock Set of available date strings ("YYYY-MM-DD"). Time slots are static.

### Interactive Body Diagram → Sidebar → Checklist Data Flow

Three connected UI regions that share state:

1. **SVG point click** → sets `activePoint` (string key: "bust", "waist", etc.)
2. **Sidebar** reads `activePoint`, renders corresponding instruction content with GSAP fade transition
3. **Checklist** has independent input fields per measurement. Each field on input updates the checkbox state and stores the value. All 6 fields filled → show completion state + save button

The checklist inputs and sidebar input are the same fields — typing in the sidebar's "Add to My Measurements" input should also update the checklist. Shared state object keyed by measurement name.

### Product/Article Filter State

Filter pills control visible items. Two instances:

1. **Featured Products** (Home): 4 filter categories. Simple DOM show/hide with GSAP opacity fade (0.3s out, 0.3s in with stagger).
2. **Collection Page**: Same filter + sort dropdown. Sort uses GSAP Flip to animate layout reorder without full re-render.

Filter state is a single active category string. On change: get all items, hide non-matching (GSAP opacity 0, visibility hidden), show matching (GSAP opacity 1, visibility visible with stagger).

### Lightbox ↔ Gallery Coordination

Lightbox needs to know: (a) which image was clicked (for "scale from origin" open animation), (b) total image count, (c) current index for prev/next/counter. On gallery item click: store index, compute source rect via getBoundingClientRect(), animate overlay fade-in + image from rect to center. Navigation updates image src and counter. Close: reverse animation or simple fade-out.

---

## Other Key Decisions

**Multi-page architecture:** 7 separate HTML pages (not SPA). Each page loads the shared bundle + its own page module. Navigation is full page reload between pages. Shared components (nav, footer) included in each HTML file — no server-side includes, just duplicated markup (7 pages is manageable). The shared JS module handles nav behavior, entrance animations, and global interactions across all pages. Page-specific JS modules initialize page-specific features (sliders, calendars, diagrams, etc.).

**GSAP plugin registration:** Core plugins (ScrollTrigger, SplitText, Flip) are registered once in the shared module. Page modules import GSAP from the shared module — plugins are already registered. No need for dynamic loading per page since all 3 plugins are used across multiple pages.

**Lenis + ScrollTrigger integration:** Lenis is initialized once in the shared module. A single event listener calls `ScrollTrigger.update()` on every Lenis scroll event. All ScrollTrigger instances automatically use Lenis's scroll position without individual configuration.

**Image asset strategy:** Each page's HTML includes `<img loading="lazy">` for below-fold images. Hero images (above fold) use `loading="eager"`. The Masonry Grid component uses imagesloaded to delay layout initialization until images are loaded, preventing visual jumps.

**Reduced motion support:** All animation initialization checks `window.matchMedia('(prefers-reduced-motion: reduce)')`. When active: disable Lenis, disable parallax, replace custom cursor with default, reduce entrance animations to simple opacity fades (no translate/scale). All CSS animations respect `prefers-reduced-motion` via media query.
