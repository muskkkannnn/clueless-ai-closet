# Product Requirements Document: Clueless AI Closet MVP

## 🎯 Product Overview

**App Name:** Clueless AI Closet  
**Tagline:** See your outfits come to life before you wear them  
**Launch Goal:** Ship a working MVP in 3 days that lets users visualize AI-generated outfit combinations  
**Target Launch:** 3-day sprint (functional MVP)

## 👥 Who It's For

### Primary User: The Style-Challenged Wardrobe Owner

People who own plenty of clothes but struggle to create good-looking outfit combinations. They often:
- Stare at their closet for 20+ minutes feeling "I have nothing to wear"
- Default to the same 3-5 "safe" outfits on repeat
- Buy new clothes hoping they'll magically know how to style them
- Feel frustrated that they can't see what combinations look good together
- Wish they could preview outfits without the hassle of physically trying on multiple combinations

**Their Current Pain:**
- Mental overload trying to visualize combinations
- Time wasted physically trying on multiple outfits
- Lack of creative outfit ideas
- No visual reference for "does this actually look good together?"

**What They Need:**
- A quick way to see outfit combinations visually
- Confidence that their outfit choices will look good
- Creative inspiration from their existing wardrobe
- A "preview before wearing" solution

### Example User Story
"Meet Sarah, a 28-year-old marketing professional who has a closet full of clothes but wears the same black pants + white shirt combo every week. She buys trendy pieces but never knows how to style them together. She needs a way to visualize different combinations from her wardrobe so she can feel confident trying new outfits without the stress of multiple try-ons each morning."

## 🔧 The Problem We're Solving

**Core Problem:** People struggle to mentally visualize how clothing items will look when combined into an outfit, leading to outfit fatigue, wardrobe underutilization, and decision paralysis.

**Why It Matters:**
- Average person uses only 20% of their wardrobe regularly
- Decision fatigue wastes 10-30 minutes daily for many people
- Lack of styling confidence leads to repetitive outfit choices
- Existing solutions don't show visual previews on a person

**Why Existing Solutions Fall Short:**
- **Acloset/Whering/Stylebook**: Show flat clothing layouts but don't visualize outfits on a person
- **Pinterest/Instagram**: Inspiration from others' clothes, not your own wardrobe
- **Physical mirror trying**: Time-consuming and limited by energy/motivation
- **Mental visualization**: Difficult for most people; often inaccurate

**Why Now:**
- AI image generation has reached consumer-ready quality
- Free AI tools make this technically feasible
- No competitor offers outfit visualization on models
- Post-pandemic: people want to refresh their style without buying new clothes

## 🎬 User Journey

### Discovery → First Use → Success

1. **Discovery Phase**
   - How they find us: Word of mouth, social media, Product Hunt
   - What catches their attention: "See your outfits on a person BEFORE wearing them"
   - Decision trigger: "Finally, something that actually shows me what outfits look like!"

2. **Onboarding (First 5 Minutes)**
   - Land on: Clean homepage with value proposition + demo video/image
   - First action: Sign up / Log in (quick via Clerk)
   - Quick win: Upload 3 clothing items → see them in their digital closet instantly

3. **Core Usage Loop**
   - Trigger: Morning routine / weekend outfit planning / event preparation
   - Action: Open canvas → select top + bottom + shoes → generate visualization
   - Reward: See AI-generated image of outfit on a person in 10-15 seconds
   - Investment: Save favorite combinations, build closet over time

4. **Success Moment**
   - "Aha!" moment: "Wow, that blue shirt DOES go with those pants! I never would have tried that."
   - Share trigger: Show friends the visualization → "How did you make this?!"
   - Retention driver: Reference saved visualizations before getting dressed

## ✨ MVP Features

### 🔴 Must Have for Launch

#### 1. Image Upload + Automatic Background Removal
- **What:** Users upload photos of clothing items; AI automatically removes backgrounds
- **User Story:** As a user, I want to upload clothing photos and have backgrounds removed automatically so that I can quickly build a clean digital closet without manual editing
- **Success Criteria:** 
  - [ ] Users can upload images (PNG, JPG, HEIC) up to 5MB
  - [ ] Background removal processes within 3-5 seconds
  - [ ] 80%+ of clothing items have clean background removal
  - [ ] Failed uploads show clear error messages
- **Technical:** BRIA RMBG-1.4 via Hugging Face Inference API
- **Priority:** P0 (Critical)

#### 2. Digital Closet Storage & Management
- **What:** Clean, organized view of all uploaded clothing items with basic categorization
- **User Story:** As a user, I want to see all my clothes in one place organized by type so that I can easily browse and select items for outfit combinations
- **Success Criteria:**
  - [ ] Items display in grid view (3-4 columns responsive)
  - [ ] Basic categories: Tops, Bottoms, Shoes, Outerwear (user selects on upload)
  - [ ] Users can filter/view by category
  - [ ] Each item shows thumbnail preview
  - [ ] Data persists across sessions (tied to user account)
- **Technical:** Supabase Postgres + Storage, Next.js Server Components
- **Priority:** P0 (Critical)

#### 3. Canvas / Outfit Builder
- **What:** Interactive workspace where users select 2-3 clothing items to create an outfit
- **User Story:** As a user, I want to select clothes from my closet and arrange them into an outfit so that I can prepare a combination for AI visualization
- **Success Criteria:**
  - [ ] Users can click items from closet to add to canvas
  - [ ] Canvas shows selected items clearly (top + bottom + optional shoes)
  - [ ] Users can remove items from canvas
  - [ ] "Generate Outfit" button is enabled when 2+ items selected
  - [ ] Visual feedback for selected items
- **Technical:** React Client Component with state management
- **Priority:** P0 (Critical)

#### 4. AI Outfit Visualization Pipeline
- **What:** AI generates an image of a person wearing the selected outfit combination
- **User Story:** As a user, I want to see how my selected clothes look on a person so that I can decide if the outfit combination works before wearing it
- **Success Criteria:**
  <!-- - [ ] Image → Text: BLIP captions describe each clothing item
  - [ ] Text → Image: Stable Diffusion generates outfit visualization -->
  - [ ] single-step AI image outfit visualization generation using Gemini NanoBanana 2.5
  - [ ] Processing completes within 15-20 seconds
  - [ ] Generated image displays at reasonable quality (512x512+)
  - [ ] Users see loading indicator with progress
  - [ ] Explicit disclaimer: "AI visualization - colors/styles approximate"
- **Technical:** 
  <!-- - BLIP image captioning (Salesforce/blip-image-captioning-base)
  - Stable Diffusion 1.5 via Hugging Face -->
  - Gemini NanoBanana 2.5 via Gemini API
  - Next.js API route handles pipeline
- **Priority:** P0 (Critical)

#### 5. Save & Download Visualizations
- **What:** Users can save generated outfit visualizations to their account and download as images
- **User Story:** As a user, I want to save and download outfit visualizations so that I can reference them later when getting dressed
- **Success Criteria:**
  - [ ] "Save" button stores visualization to user's gallery
  - [ ] "Download" button downloads image as PNG
  - [ ] Saved visualizations persist in user account
  - [ ] Users can view saved gallery on separate page
  - [ ] Gallery shows thumbnail + timestamp
- **Technical:** Supabase Storage + Database tables
- **Priority:** P0 (Critical)

#### 6. Delete Closet Items
- **What:** Users can remove clothing items from their digital closet
- **User Story:** As a user, I want to delete clothes I no longer own so that my closet stays accurate and organized
- **Success Criteria:**
  - [ ] Delete button/icon on each item
  - [ ] Confirmation modal: "Are you sure?"
  - [ ] Item removed from database and storage
  - [ ] UI updates immediately after deletion
- **Technical:** DELETE API endpoint + Supabase RLS
- **Priority:** P0 (Critical)

#### 7. Authentication (Login/Signup)
- **What:** User authentication to save closets and visualizations per account
- **User Story:** As a user, I want to create an account so that my closet and outfit visualizations are saved and accessible across sessions
- **Success Criteria:**
  - [ ] Email/password signup
  - [ ] Google OAuth (optional but preferred)
  - [ ] Protected routes for closet/canvas pages
  - [ ] Session persists across browser sessions
  - [ ] Logout functionality
- **Technical:** Clerk (free tier: 10K MAU)
- **Priority:** P0 (Critical)

### 🟡 Nice to Have (If Time Allows)
- **Re-generate with variations**: Try different AI seeds for same outfit
- **Item metadata**: Add notes like "summer", "work", "formal"
- **Quick filters**: Show only "tops", "bottoms", etc.

### 🚫 NOT in MVP (Saving for Later)

| Feature | Why Wait | Planned For |
|---------|----------|-------------|
| AI Outfit Recommendations | Complex logic; requires training data | Version 2 (Month 2-3) |
| Calendar Planning | Scope creep; not core to validation | Version 2 |
| Social Feed / Sharing | Premature; need users first | Version 2-3 |
| Mobile App | Web-first validates faster | Version 3+ |
| Custom UI Polish | Function over form for MVP | Ongoing post-launch |
| Advanced Try-on (ControlNet) | Requires GPU infrastructure | Version 3-4 |
| User Analytics Dashboard | Not needed for MVP testing | Version 2 |
| Multiple Closets | Edge case; most users have one | Future |
| WhatsApp Direct Share | Download + share works for now | Future |

*Why we're waiting: These features would add 2-4 weeks to development. MVP focuses on core value: "Can we generate outfit visualizations that users find valuable?"*

## 📊 How We'll Know It's Working

### Launch Success Metrics (First 30 Days)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **End-to-End Completion** | 1 full workflow working | Manual testing: upload → closet → canvas → visualize → save → download |
| **Visualization Success Rate** | 70%+ generate without errors | Track API failures in logs |
| **User Uploads** | 5-10 beta testers upload 3+ items each | Database query: COUNT items by user |

### Growth Metrics (Months 2-3)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Active Users** | 50-100 registered users | Clerk dashboard |
| **Avg Items per User** | 10+ items | Database analytics |
| **Visualizations Generated** | 200+ total | Database count |
| **Repeat Usage** | 30% users return within 7 days | Login frequency tracking |

**North Star Metric (Future):** Number of visualizations generated per week (indicates core value delivery)

## 🎨 Look & Feel

**Design Vibe:** Minimal, clean, functional, fast

**Visual Principles:**
1. **Function First**: Every element serves a purpose; no decorative bloat
2. **Clean & Breathable**: White space, clear typography, simple layouts
3. **Fast & Responsive**: Instant feedback, smooth interactions, mobile-friendly
4. **Honest AI**: Clear labeling that this is AI-generated, not perfect replication

**Key Screens/Pages:**

1. **Landing/Home Page**: Value prop + CTA to sign up/login
2. **Digital Closet (Dashboard)**: Grid of clothing items with upload button
3. **Canvas/Outfit Builder**: Workspace to select items + generate button
4. **Visualization Result**: Display generated image with save/download options
5. **Saved Gallery**: View previously generated outfit visualizations
6. **Login/Signup**: Clerk pre-built UI
7. **Settings**: Basic account management (future: delete account)
8. **Loading State**: Progress indicator during AI generation (10-20 seconds)

### Simple Wireframe - Core Flow

```
┌─────────────────────────────────────┐
│         [Home/Landing]              │
│  "See outfits before wearing them"  │
│         [Sign Up] [Login]           │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│      [Digital Closet Grid]          │
│  [+Upload]                          │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐          │
│  │👕 │ │👖 │ │👟 │ │🧥 │          │
│  └───┘ └───┘ └───┘ └───┘          │
│  [Create Outfit Button]             │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         [Canvas Builder]            │
│   Selected Items:                   │
│   [👕 Top] [👖 Bottom] [👟 Shoes]  │
│                                     │
│   [Generate Visualization]          │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     [Visualization Result]          │
│   ┌─────────────────────┐          │
│   │                     │          │
│   │   [AI Generated     │          │
│   │    Outfit Image]    │          │
│   │                     │          │
│   └─────────────────────┘          │
│   [💾 Save] [⬇️ Download]          │
│   [🔄 Generate Again]               │
└─────────────────────────────────────┘
```

## ⚡ Technical Considerations

**Platform:** Web-first (responsive)  
**Framework:** Next.js 15 (App Router)  
**Styling:** Tailwind CSS (core utility classes only)  
**UI Components:** Headless components (may add Radix UI post-MVP for polish)

**Performance Goals:**
- **Page Load:** < 3 seconds (initial)
- **Upload Processing:** < 5 seconds (background removal)
- **AI Visualization:** < 20 seconds (manage expectations with loading UI)
- **Image Optimization:** Next.js Image component for thumbnails

**Browser/Device Support:**
- **Desktop:** Chrome, Safari, Firefox, Edge (latest 2 versions)
- **Mobile:** iOS Safari 14+, Chrome Android (responsive layout)
- **Tablet:** Optimized for tablet landscape/portrait

**Accessibility:**
- WCAG 2.1 AA minimum
- Keyboard navigation for core flows
- Alt text for images
- Color contrast ratios met

## 🛡️ Quality Standards (Anti-Vibe Rules)

### What This App Will NOT Accept:

**Code Quality:**
- ❌ No `localStorage` or `sessionStorage` in artifacts (use React state or Supabase)
- ❌ No API keys exposed in client-side code
- ❌ No "TODO" comments in production code
- ✅ TypeScript where possible (Next.js default)
- ✅ Handle errors explicitly (try-catch with user-friendly messages)
- ✅ Protect API routes with authentication checks

**Design Quality:**
- ❌ No placeholder content in production ("Lorem ipsum", sample images)
- ❌ No broken responsive layouts (test mobile before launch)
- ❌ No inaccessible color contrasts (run basic checks)
- ✅ Use Tailwind utility classes consistently
- ✅ Loading states for all async operations
- ✅ Clear error messages for users

**Feature Quality:**
- ❌ No half-working features—complete or cut
- ❌ No features outside MVP scope (save for v2)
- ❌ No shipping without end-to-end testing
- ✅ One complete user journey works perfectly
- ✅ Critical paths tested with real data
- ✅ Graceful degradation when AI fails

*These standards will be enforced during development with AI coding assistants.*

## 💰 Budget & Constraints

### Development Budget: $0 (Free Tier Only)

**Tool Costs (Monthly):**
- **Clerk Auth:** Free (up to 10K MAU)
- **Supabase:** Free (500MB DB, 1GB storage, 50K MAU)
- **Vercel Hosting:** Free (Hobby plan)
- **Gemini Nano Banana 2.5 API:** Free (rate-limited)
- **Hugging Face Inference API:** Free (rate-limited)
- **Domain (optional):** $12/year (post-MVP)

**Total MVP Cost:** $0/month  
**Expected Cost at 100 Users:** $0-20/month  
**Scale Threshold:** 500-1000 users before needing paid tiers

### Timeline

**3-Day Sprint Breakdown:**
- **Day 1 (8-10 hrs):** Setup + Auth + Database + Upload system
- **Day 2 (10-12 hrs):** Closet UI + Canvas Builder + Basic styling
- **Day 3 (10-12 hrs):** AI visualization pipeline + Save/Download + Testing + Deploy

**Total Development Time:** 28-34 hours (intensive sprint)

### Technical Constraints

**Hard Requirements:**
- Next.js 15 (App Router) only—no alternatives
- Tailwind CSS for styling—no custom CSS frameworks
- Free-tier tools only—no paid services
- Supabase for database + storage
- Clerk for authentication
- Hugging Face for AI models

**Current Limitations:**
- Rate limits on AI APIs (manage with loading states)
- 5MB file upload limit (reasonable for phone photos)
- No custom model training (use pre-trained only)
- Basic UI polish (Radix UI reserved for post-MVP)

**Not Allowed:**
- No mobile app development (web only)
- No custom backend (Next.js API routes only)
- No paid AI APIs (OpenAI, Replicate, etc.)
- No complex state management libraries (React built-ins sufficient)

## 🚨 Risk Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| AI visualization quality disappointing | High | High | Set clear expectations with disclaimer; offer "regenerate" option; label as "experimental" |
| Free API rate limits hit during testing | Medium | Medium | Implement queuing system; show "high traffic" message; throttle requests |
| Background removal fails on complex images | Medium | Low | Manual fallback option; guide users to photograph clothes on plain backgrounds |
| 3-day timeline too ambitious | Medium | High | Cut features ruthlessly; focus on one working flow; polish later |
| Users expect perfect virtual try-on | High | Medium | Homepage copy emphasizes "visualization" not "try-on"; show example outputs |
| Technical bugs block launch | Low | High | Daily testing; rollback plan; keep MVP scope minimal |

## ✅ MVP Completion Checklist

### Development Complete
- [ ] **Auth Flow:** Users can sign up, log in, log out
- [ ] **Upload Flow:** Image upload → background removal → save to closet
- [ ] **Closet View:** Display user's items in grid, filter by category
- [ ] **Canvas Builder:** Select 2-3 items for outfit
- [ ] **AI Pipeline:** Generate visualization (Gemini Nana Banana 2.5)
- [ ] **Save/Download:** Store visualization, download as PNG
- [ ] **Delete Items:** Remove items from closet

### Quality Assurance
- [ ] **End-to-End Test:** Complete flow works without errors
- [ ] **Mobile Responsive:** Test on iOS Safari, Chrome Android
- [ ] **Error Handling:** All API failures show user-friendly messages
- [ ] **Loading States:** Progress indicators for upload, AI generation
- [ ] **Edge Cases:** Handle empty closet, failed uploads, slow APIs

### Launch Ready
- [ ] **Deployment:** Live on Vercel with custom domain (optional)
- [ ] **Environment Variables:** All API keys secure
- [ ] **Monitoring:** Basic error logging (Vercel Analytics)
- [ ] **Documentation:** README with setup instructions
- [ ] **Beta Testing:** 3-5 friends test complete flow

### User Experience
- [ ] **First-Time User:** Can complete journey in < 10 minutes
- [ ] **Value Clear:** Homepage explains what app does
- [ ] **Expectations Set:** AI disclaimer visible
- [ ] **Help Available:** Contact method or support email

## 📋 Definition of Done for MVP

**The MVP is ready to launch when:**

1. ✅ **Core Journey Works:** A user can sign up → upload 3 clothes → create outfit → visualize → save → download without any broken steps
2. ✅ **Performance Acceptable:** AI visualization completes within 20 seconds 80% of the time
3. ✅ **Mobile Functional:** Basic usability on phone browsers (not perfect, but works)
4. ✅ **Honest Messaging:** Clear disclaimers that AI is approximate, not perfect
5. ✅ **Beta Validated:** 3-5 testers successfully complete flow and provide feedback
6. ✅ **Deployed:** Live URL accessible to others
7. ✅ **Documented:** Basic README for future development

**Not Required for MVP:**
- ❌ Perfect UI polish
- ❌ Advanced features (recommendations, calendar, etc.)
- ❌ 100% AI accuracy
- ❌ Mobile app
- ❌ Social features

## 📝 Next Steps

### Immediate Actions (After PRD Approval):
1. **Review this PRD** with fresh eyes—does it match your vision?
2. **Save document** as `PRD-Clueless-AI-Closet-MVP.md`
3. **Create Technical Design Document (Part III)** for implementation details
4. **Set up development environment** (Next.js, Clerk, Supabase accounts)
5. **Start Day 1 build** following the 3-day roadmap from research

### Post-MVP Actions:
1. **Beta Testing:** Share with 5-10 friends/family
2. **Gather Feedback:** What worked? What confused them?
3. **Fix Critical Bugs:** Address blockers preventing use
4. **Iteration Plan:** Decide on v2 features based on feedback
5. **Public Launch:** Product Hunt, Reddit, social media

---

## 🎯 Success Definition

**This MVP succeeds if:**
- Users can create ONE complete outfit visualization without major issues
- 3/5 beta testers say "this is useful, I'd use this again"
- You learn what users value most (accuracy? speed? variety?)
- Technical feasibility is proven for future investment

**This MVP fails if:**
- Core flow is too broken to complete
- AI quality is so poor users can't see any value
- Technical limitations make it unusable

---

*PRD Version: 1.0*  
*Created: January 2026*  
*Status: Ready for Technical Design Document*  
*Owner: [Your Name]*  
*Next Document: Technical Design Document (Part III)*

---

## Appendix A: Referenced Research

This PRD incorporates findings from comprehensive market research including:
- Competitor analysis (Acloset, Whering, Stylebook, Fits)
- AI tooling evaluation (BRIA RMBG-1.4, BLIP, Stable Diffusion 1.5)
- Technical stack validation (Next.js 15, Clerk, Supabase, Vercel)
- 3-day MVP roadmap with hour-by-hour breakdown

**Key Insight from Research:**  
✨ **ZERO competitors offer outfit visualization on models—this is your unique positioning.**

---

## Appendix B: AI Pipeline Technical Details

### Image → Text → Image Flow

```
User selects 3 items (top, bottom, shoes)
         ↓
Fetch images from Supabase Storage
         ↓
Call Gemini NanoBanana 2.5 with:
  - reference images
  - a short instruction prompt

<!-- Call BLIP API 3x (caption each item)
  Response: "blue denim jeans", "white cotton t-shirt", "black sneakers" -->
         ↓
<!-- Build prompt: "A fashion model wearing a white cotton t-shirt, 
blue denim jeans, and black sneakers. Full body photo, 
professional fashion photography, studio lighting."
         ↓
Call Stable Diffusion API with prompt
  Processing: 5-10 seconds -->

NanoBanana generates a model wearing the outfit
         ↓
Return generated 512x512 image
         ↓
Save to Supabase Storage + Database
         ↓
Display to user with save/download options
```

**Trade-offs:**
- ⚠️ Colors/patterns approximate (60-75% accuracy)
- ⚠️ Not true "virtual try-on" (interprets descriptions)
- ✅ Fast to implement (3 days feasible)
- ✅ Free tools available
- ✅ Upgradeable later to better models

---

*End of Document*