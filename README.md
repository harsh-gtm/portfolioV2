



# Personal Portfolio Overhaul

This repo if for my redesigned personal portfolio. This project represents a complete architectural and visual overhaul of my previous site, moving from a static presentation to a more fluid and lively experience.

## The Vision
I chose the name **"Unsospiro"** (Italian for "a sigh") to capture a specific aesthetic: continuous and seamless movement. As the piano work by Franz Lizst is a musical sigh that flows effortlessly between notes, I wanted my portfolio to feel similiar in the sense that the viewer should go flow through my journey effortlessly.

This overhaul focuses on eliminating friction in the user journey, replacing abrupt transitions with more fluid and orchestrated animations that feel intentional and premium.

## Technical Stack
* **Framework:** [Next.js](https://nextjs.org/) 
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) 
* **Animation Engine:** [GSAP](https://gsap.com/)
* **Motion Framework:** [Motion.dev](https://motion.dev/) 
* **Scroll Mechanics:** [Lenis Scroll](https://github.com/darkroomengineering/lenis)

## Design Evolution
I am transitioning away from my previous design to embrace a more atmospheric, immersive layout. Key updates include:
* **Parallax Integration:** Implementing multi-layered parallax effects on the home screen to create spatial depth.
* **Fluid Motion:** Utilizing GSAP ScrollTrigger to sync animation timelines with scroll velocity, ensuring the site feels responsive to the user's input.
* **Performance:** Refactoring component architecture to maintain 60fps interaction during complex animation sequences.

---

### Before (Legacy Portfolio)
<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/736c8ef0-9a08-488c-810d-2a8e3f5e5c15" />

*[unsospiro.com](unsospiro.com)*

### The New Direction (Current Development)


https://github.com/user-attachments/assets/10c2ba02-6b22-425b-af85-f2f4a1456640




---

## Key Development Challenges
* **Scroll Synchronization:** Balancing Lenis's smooth-scroll wrapper with GSAP's pin-functionality to ensure triggers remain accurate across different viewport heights.
* **Performance Budgeting:** Using hardware-accelerated CSS properties to maintain high frame rates while running multiple concurrent animation timelines.
* **Veiw:** Making sure the look and feel of the website remains constant throughout different devices
  
# Key features to implement: 
---
## Blog
- Implement a headless CMS to manage, edit, and publish my technical write ups and blogs
