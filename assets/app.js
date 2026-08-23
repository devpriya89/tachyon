const root = document.documentElement
const topbar = document.querySelector(".topbar")
const cursor = document.querySelector(".cursor")

const setTopbar = () => {
  if (!topbar) return
  topbar.classList.toggle("is-scrolled", window.scrollY > 12)
}

setTopbar()
window.addEventListener("scroll", setTopbar, { passive: true })

// 1. Top Reading Scroll Progress Bar
const scrollProgress = document.getElementById("scrollProgress")
const updateScrollProgress = () => {
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight
  if (totalHeight > 0 && scrollProgress) {
    const progress = (window.scrollY / totalHeight) * 100
    scrollProgress.style.width = `${progress}%`
  }
}
window.addEventListener("scroll", updateScrollProgress, { passive: true })

document.querySelectorAll(".hero").forEach((hero) => {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect()
    hero.style.setProperty("--spot-x", `${event.clientX - rect.left}px`)
    hero.style.setProperty("--spot-y", `${event.clientY - rect.top}px`)
  })
})

// 2. Interactive Hero Canvas Particle Background
const canvas = document.getElementById("heroCanvas")
if (canvas) {
  const ctx = canvas.getContext("2d")
  let width = (canvas.width = canvas.parentElement.offsetWidth)
  let height = (canvas.height = canvas.parentElement.offsetHeight)

  const resize = () => {
    width = canvas.width = canvas.parentElement.offsetWidth
    height = canvas.height = canvas.parentElement.offsetHeight
  }
  window.addEventListener("resize", resize)

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 2 + 1,
  }))

  let mouseX = width / 2
  let mouseY = height / 2

  canvas.parentElement.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
  })

  const draw = () => {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "rgba(223, 255, 50, 0.7)"
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)"

    particles.forEach((p, i) => {
      p.x += p.vx
      p.y += p.vy

      if (p.x < 0 || p.x > width) p.vx *= -1
      if (p.y < 0 || p.y > height) p.vy *= -1

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j]
        const dx = p.x - p2.x
        const dy = p.y - p2.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 110) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }

      const mdx = p.x - mouseX
      const mdy = p.y - mouseY
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
      if (mdist < 140) {
        ctx.strokeStyle = "rgba(223, 255, 50, 0.25)"
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(mouseX, mouseY)
        ctx.stroke()
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)"
      }
    })
    requestAnimationFrame(draw)
  }
  draw()
}

// 3. Counter Animations for Stats
const counterElements = document.querySelectorAll("[data-count]")
if (counterElements.length > 0) {
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10)
    const suffix = el.dataset.suffix || ""
    const prefix = el.dataset.prefix || ""
    const duration = 1400
    const start = performance.now()

    const step = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(easeProgress * target)
      el.textContent = `${prefix}${current.toLocaleString()}${suffix}`
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        el.textContent = `${prefix}${target.toLocaleString()}${suffix}`
      }
    }
    requestAnimationFrame(step)
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target)
          counterObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.2 }
  )

  counterElements.forEach((el) => counterObserver.observe(el))
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches

if (cursor && finePointer && !reducedMotion) {
  let pointerX = window.innerWidth / 2
  let pointerY = window.innerHeight / 2
  let cursorX = pointerX
  let cursorY = pointerY
  let targetEl = null
  let labelEl = null

  const setCursorSize = (width, height, radius = "999px") => {
    cursor.style.setProperty("--cursor-w", `${width}px`)
    cursor.style.setProperty("--cursor-h", `${height}px`)
    cursor.style.setProperty("--cursor-r", radius)
  }

  const tick = () => {
    let targetX = pointerX
    let targetY = pointerY

    if (targetEl && document.body.contains(targetEl)) {
      const rect = targetEl.getBoundingClientRect()
      targetX = rect.left + rect.width / 2
      targetY = rect.top + rect.height / 2
      setCursorSize(rect.width + 16, rect.height + 14, getComputedStyle(targetEl).borderRadius || "22px")
    } else if (labelEl && document.body.contains(labelEl)) {
      const label = labelEl.dataset.cursor || "Open"
      setCursorSize(Math.max(70, label.length * 8 + 34), 40, "999px")
      cursor.textContent = label
      cursor.classList.add("is-labeled")
    } else {
      setCursorSize(28, 28)
      cursor.textContent = ""
      cursor.classList.remove("is-labeled")
    }

    cursorX += (targetX - cursorX) * 0.18
    cursorY += (targetY - cursorY) * 0.18
    cursor.style.setProperty("--cursor-x", `${cursorX}px`)
    cursor.style.setProperty("--cursor-y", `${cursorY}px`)
    requestAnimationFrame(tick)
  }

  document.addEventListener("pointermove", (event) => {
    pointerX = event.clientX
    pointerY = event.clientY
    cursor.classList.remove("is-hidden")
  })

  document.addEventListener("pointerdown", () => cursor.classList.add("is-active"))
  document.addEventListener("pointerup", () => cursor.classList.remove("is-active"))
  document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"))
  document.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"))

  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointerenter", () => {
      targetEl = el
      cursor.classList.remove("is-labeled")
    })
    el.addEventListener("pointerleave", () => {
      targetEl = null
      el.style.transform = ""
    })
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect()
      const moveX = (event.clientX - rect.left - rect.width / 2) * 0.12
      const moveY = (event.clientY - rect.top - rect.height / 2) * 0.12
      el.style.transform = `translate(${moveX}px, ${moveY}px)`
    })
  })

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("pointerenter", () => {
      labelEl = el
    })
    el.addEventListener("pointerleave", () => {
      labelEl = null
    })
  })

  requestAnimationFrame(tick)
}

document.querySelectorAll("a[href]").forEach((link) => {
  const url = new URL(link.href, window.location.href)
  const isInternalPage = url.origin === window.location.origin && url.pathname.endsWith(".html")
  if (!isInternalPage) return

  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    document.body.classList.add("is-transitioning")
    window.setTimeout(() => {
      window.location.href = link.href
    }, 260)
  })
})

if ("IntersectionObserver" in window && !reducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.14 }
  )

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"))
}

document.querySelectorAll("[data-filter-group]").forEach((group) => {
  const buttons = group.querySelectorAll("[data-filter]")
  const targetSelector = group.dataset.filterGroup
  const items = document.querySelectorAll(targetSelector)

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter
      buttons.forEach((item) => item.classList.toggle("is-active", item === button))
      items.forEach((item) => {
        const terms = (item.dataset.track || "").split(" ")
        item.hidden = filter !== "all" && !terms.includes(filter)
      })
    })
  })
})

document.querySelectorAll("[data-tab-group]").forEach((group) => {
  const buttons = group.querySelectorAll("[data-tab]")
  const panels = document.querySelectorAll(`[data-tab-panel="${group.dataset.tabGroup}"]`)

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab
      buttons.forEach((item) => item.classList.toggle("is-active", item === button))
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.tabId !== target
      })
    })
  })
})

// 4. Slide-over Venture Drawer Modal
const drawerOverlay = document.getElementById("ventureDrawerOverlay")
const drawerContent = document.getElementById("drawerContent")
const drawerClose = document.getElementById("drawerClose")

const ventureDataMap = {
  takumi: {
    title: "Takumi Delhi",
    tag: "01 / Game Development",
    date: "May 2-3, 2026 • 24 Hours",
    body: "A 24-hour offline game-development hackathon for under-18 builders in Delhi, created around craftsmanship, precision, technical iteration, workshops, mentorship, and final presentations. Built in collaboration with DoE.",
    meta: [
      { label: "Registrations", value: "~1,000" },
      { label: "Participants", value: "~800" },
      { label: "Age Group", value: "Under 18" },
      { label: "Format", value: "24H Offline" }
    ],
    links: [
      { label: "Website", url: "https://www.takumidelhi.com/" },
      { label: "Media 01", url: "https://drive.google.com/drive/folders/1CCVeyGwToEXQIxz5g55AaG9CGSqqWF0A?usp=drive_link" },
      { label: "Media 02", url: "https://drive.google.com/drive/folders/1qF369Ml_Ky67np3veoC4voD8tO7Ve5VD?usp=drive_link" }
    ]
  },
  aaroh: {
    title: "AAROH 2026",
    tag: "02 / Student Innovation",
    date: "Aug 1-2, 2026 • IIIT Delhi",
    body: "A Delhi NCR student innovation hackathon at IIIT Delhi for participants aged 15+. Teams identify a real problem, understand a real user, build something testable, iterate, and launch the path forward across 4 challenge tracks.",
    meta: [
      { label: "Builders", value: "200+" },
      { label: "Tracks", value: "4 Tracks" },
      { label: "Team Size", value: "2-3 Members" },
      { label: "Venue", value: "IIIT Delhi" }
    ],
    links: [
      { label: "Website", url: "https://aarohindia.com/" },
      { label: "Photos", url: "https://photos.app.goo.gl/ipECCr2Dz9jkjKfM9" }
    ]
  },
  "build-guild": {
    title: "Build Guild Delhi",
    tag: "03 / Hardware Enthusiast Meetup",
    date: "Apr 18, 2025 • CP Delhi",
    body: "A one-day hardware enthusiast meetup at Pinnacle Space, Connaught Place, conducted as part of Hack Club Blueprint's global Build Guild week. Students aged 13-18 built with breadboards, microcontrollers, soldering, competitions, showcases, and hardware hackathon activities.",
    meta: [
      { label: "Partner", value: "Hack Club" },
      { label: "Age Group", value: "13 - 18" },
      { label: "Focus", value: "Hardware Hackathon" },
      { label: "Venue", value: "Connaught Place" }
    ],
    links: [
      { label: "Website", url: "https://buildguilddelhi.space/" },
      { label: "Photos", url: "https://photos.app.goo.gl/cGwG4F5jWQhAVyFx6" }
    ]
  },
  "beyond-horizons": {
    title: "Beyond Horizons",
    tag: "04 / Science & Astronomy",
    date: "Outreach Program • Ongoing",
    body: "An astronomy and space exploration initiative in partnership with Fotocart. The model combines accessible theory, equipment exposure, guided telescope observation where feasible, and direct student discussion.",
    meta: [
      { label: "Locations", value: "Nand Nagri & IIIT" },
      { label: "Partner", value: "Fotocart" },
      { label: "Subject", value: "Astronomy & Optics" },
      { label: "Tools", value: "Telescopes" }
    ],
    links: []
  },
  "vector-aerotech": {
    title: "Vector Aerotech",
    tag: "05 / Aerial Robotics & Defense",
    date: "Autonomous UAVs • Defense & Enterprise",
    body: "Vector Aerotech is an advanced autonomous drone and aerospace defense startup born out of the Tachyon builder collective. Engineering proprietary flight controllers, autonomous swarming algorithms, encrypted long-range mesh comms, and heavy-payload tactical multirotors, Vector Aerotech has secured and deployed critical systems across private enterprise, governmental, and military defense contracts.\n\nFrom high-altitude surveillance, border geospatial intelligence, and tactical reconnaissance to infrastructure pipeline scanning and GPS-denied autonomous flight, Vector Aerotech serves as proof of taking young hardware engineers directly from workbench prototypes to industrial and military defense grade aerospace deployment.",
    meta: [
      { label: "Domain", value: "Autonomous Drones & Defense" },
      { label: "Contracts", value: "Private, Gov & Military" },
      { label: "Avionics", value: "Custom Flight Controllers" },
      { label: "Payloads", value: "Thermal / Edge-AI Vision" },
      { label: "Ecosystem", value: "Tachyon Venture" }
    ],
    links: [
      { label: "Venture Overview", url: "ventures.html#vector-aerotech" }
    ]
  },
  robotics: {
    title: "Robotics / Electronics Initiative",
    tag: "06 / Competitive Robotics",
    date: "In Development • 2026",
    body: "A new robotics competition and student hardware network being developed in collaboration with IIT Bombay and its student network. Target is up to 50 teams, with a long-term direction toward FRC-style hardware engineering.",
    meta: [
      { label: "Target Teams", value: "50 Teams" },
      { label: "Partner", value: "IIT Bombay Network" },
      { label: "Direction", value: "FRC Robotics" }
    ],
    links: []
  },
  campfire: {
    title: "Campfire Delhi",
    tag: "07 / Community & Sprint",
    date: "Collaborative Gathering • Delhi",
    body: "A collaborative community sprint and student builder gathering organized in collaboration with Hack Club and Master's Union.",
    meta: [
      { label: "Partner 01", value: "Hack Club" },
      { label: "Partner 02", value: "Master's Union" },
      { label: "Format", value: "Community Sprint" },
      { label: "City", value: "Delhi" }
    ],
    links: [
      { label: "Drive Media", url: "https://drive.google.com/drive/folders/1Sw3rm1HqWhFqRtno79cSkpN7cug8-z_7" }
    ]
  },
  metamorphosis: {
    title: "Metamorphosis",
    tag: "08 / Teammate Initiative",
    date: "In collaboration with IIT Delhi (IITD)",
    body: "A transformative student builder and technical innovation initiative led by one of our teammates in collaboration with IIT Delhi (IITD).",
    meta: [
      { label: "Collaboration", value: "IIT Delhi (IITD)" },
      { label: "Lead", value: "Tachyon Teammate" },
      { label: "Focus", value: "Innovation & Build" },
      { label: "Ecosystem", value: "Affiliate Initiative" }
    ],
    links: [
      { label: "Drive Media", url: "https://drive.google.com/drive/folders/1bm8WlXUhC-PBbkCQ1u3LrhPAwNSaoEt3" }
    ]
  },
  "delhi-ai-summit": {
    title: "Delhi AI Impact Summit — AI Innovation Pavilion",
    tag: "09 / Government Exhibit Head",
    date: "Govt of NCT of Delhi Collaboration",
    body: "Our team was appointed as the official Head for the Government of NCT of Delhi Exhibit and AI Innovation Pavilion at the Delhi AI Impact Summit. We curated and demonstrated cutting-edge student artificial intelligence projects, autonomous UAV flight avionics, and edge computing robotics directly to government leadership, state dignitaries, and industry delegates.",
    meta: [
      { label: "Role", value: "Exhibit Head & Lead" },
      { label: "Partner", value: "Govt of NCT of Delhi" },
      { label: "Focus", value: "AI & Autonomous Drones" },
      { label: "Summit", value: "Delhi AI Impact Summit" }
    ],
    links: [
      { label: "Exhibit Overview", url: "ventures.html#delhi-ai-summit" }
    ]
  }
}

const openDrawer = (id) => {
  const data = ventureDataMap[id]
  if (!data || !drawerOverlay || !drawerContent) return

  drawerContent.innerHTML = `
    <span class="drawer-tag">${data.tag}</span>
    <h2 class="drawer-title">${data.title}</h2>
    <div class="drawer-date">${data.date}</div>
    <p class="drawer-body">${data.body}</p>
    <div class="drawer-meta-grid">
      ${data.meta.map(m => `
        <div class="drawer-meta-card">
          <strong>${m.value}</strong>
          <span>${m.label}</span>
        </div>
      `).join("")}
    </div>
    <div class="drawer-links">
      ${data.links.map(l => `
        <a class="button button--dark" href="${l.url}" target="_blank" rel="noreferrer">${l.label} <span class="arrow">-&gt;</span></a>
      `).join("")}
    </div>
  `
  drawerOverlay.classList.add("is-open")
  drawerOverlay.setAttribute("aria-hidden", "false")
}

const closeDrawer = () => {
  if (!drawerOverlay) return
  drawerOverlay.classList.remove("is-open")
  drawerOverlay.setAttribute("aria-hidden", "true")
}

if (drawerClose) drawerClose.addEventListener("click", closeDrawer)
if (drawerOverlay) {
  drawerOverlay.addEventListener("click", (e) => {
    if (e.target === drawerOverlay) closeDrawer()
  })
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer()
})

document.querySelectorAll("[data-drawer-id]").forEach((el) => {
  el.addEventListener("click", (e) => {
    const id = el.dataset.drawerId
    if (ventureDataMap[id]) {
      e.preventDefault()
      openDrawer(id)
    }
  })
})

// 5. Live Search Filter on Ventures Page
const ventureSearchInput = document.getElementById("ventureSearch")
if (ventureSearchInput) {
  ventureSearchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim()
    const rows = document.querySelectorAll(".venture-row")
    rows.forEach((row) => {
      const text = row.textContent.toLowerCase()
      row.hidden = query !== "" && !text.includes(query)
    })
  })
}

// 6. Interactive Pill Selectors & Enhanced Contact Form
const intentPillsContainer = document.getElementById("intentPills")
const intentSelect = document.getElementById("intent")

if (intentPillsContainer && intentSelect) {
  const pills = intentPillsContainer.querySelectorAll(".intent-pill")
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pill.classList.toggle("is-selected")
      const selected = Array.from(pills)
        .filter((p) => p.classList.contains("is-selected"))
        .map((p) => p.dataset.value)
      
      if (selected.length > 0) {
        intentSelect.value = selected[0]
      }
    })
  })
}

const contactForm = document.querySelector("[data-contact-form]")
if (contactForm) {
  const note = contactForm.querySelector(".form-note")
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const data = new FormData(contactForm)
    const name = String(data.get("name") || "Builder").trim()
    if (note) {
      note.style.color = "#4d7cff"
      note.textContent = `✓ Thank you ${name}! Your collaboration request has been received. We'll be in touch soon.`
    }
    contactForm.reset()
    if (intentPillsContainer) {
      intentPillsContainer.querySelectorAll(".intent-pill").forEach(p => p.classList.remove("is-selected"))
    }
  })
}

// 7. Minimal Avant-Garde Menu & Live Clock System
const minimalMenuBtn = document.getElementById("minimalMenuBtn")
const minimalMenuClose = document.getElementById("minimalMenuClose")
const minimalMenuOverlay = document.getElementById("minimalMenuOverlay")

const openMinimalMenu = () => {
  if (!minimalMenuOverlay) return
  minimalMenuOverlay.classList.add("is-open")
  minimalMenuOverlay.setAttribute("aria-hidden", "false")
  document.body.style.overflow = "hidden"
}

const closeMinimalMenu = () => {
  if (!minimalMenuOverlay) return
  minimalMenuOverlay.classList.remove("is-open")
  minimalMenuOverlay.setAttribute("aria-hidden", "true")
  document.body.style.overflow = ""
}

if (minimalMenuBtn) {
  minimalMenuBtn.addEventListener("click", openMinimalMenu)
}

if (minimalMenuClose) {
  minimalMenuClose.addEventListener("click", closeMinimalMenu)
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && minimalMenuOverlay && minimalMenuOverlay.classList.contains("is-open")) {
    closeMinimalMenu()
  }
})

// Close menu when clicking outside or clicking any nav link
if (minimalMenuOverlay) {
  minimalMenuOverlay.querySelectorAll(".menu-nav-item").forEach(link => {
    link.addEventListener("click", () => {
      closeMinimalMenu()
    })
  })
}

// Live Delhi NCR Clock (IST / UTC+5:30)
const heroLiveClock = document.getElementById("heroLiveClock")
const menuLiveClock = document.getElementById("menuLiveClock")

const updateDelhiClock = () => {
  const now = new Date()
  const options = {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }
  const timeString = new Intl.DateTimeFormat([], options).format(now)
  if (heroLiveClock) heroLiveClock.textContent = `${timeString} IST`
  if (menuLiveClock) menuLiveClock.textContent = `${timeString} IST`
}

updateDelhiClock()
setInterval(updateDelhiClock, 1000)

// 8. Interactive 3D Quadcopter Drone Model (Three.js - Proportional & Distortion-Free)
const init3DDrone = () => {
  const container = document.getElementById("droneContainer")
  const canvas = document.getElementById("droneCanvas")
  
  if (!container || !canvas || typeof THREE === "undefined") return

  // Precise container dimension reader
  const getSize = () => {
    const rect = container.getBoundingClientRect()
    return {
      w: rect.width || container.clientWidth || 400,
      h: rect.height || container.clientHeight || 400
    }
  }

  let { w, h } = getSize()

  // Scene setup with distortion-free 35-degree cinematic FOV & ample breathing room
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 1000)
  camera.position.set(0, 2.8, 9.2)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  })
  renderer.setSize(w, h, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.3)
  dirLight.position.set(5, 10, 7)
  dirLight.castShadow = true
  scene.add(dirLight)

  const rimLight = new THREE.DirectionalLight(0x4d7cff, 0.7)
  rimLight.position.set(-6, -4, -6)
  scene.add(rimLight)

  const accentLight = new THREE.PointLight(0xdfff32, 0.5, 12)
  accentLight.position.set(0, 2, 0)
  scene.add(accentLight)

  // Drone Group
  const droneGroup = new THREE.Group()
  scene.add(droneGroup)

  // Materials
  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x141414,
    roughness: 0.35,
    metalness: 0.85
  })

  const stealthMat = new THREE.MeshStandardMaterial({
    color: 0x242424,
    roughness: 0.4,
    metalness: 0.6
  })

  const accentLimeMat = new THREE.MeshBasicMaterial({ color: 0xdfff32 })
  const ledGreenMat = new THREE.MeshBasicMaterial({ color: 0x10b981 })
  const ledRedMat = new THREE.MeshBasicMaterial({ color: 0xff5c2b })
  const lensGlowMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff })
  const copperMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.2 })

  // 1. Balanced Central Hull / Fuselage (Symmetrical & Sleek)
  const hullGeo = new THREE.BoxGeometry(1.5, 0.38, 1.6)
  const hullMesh = new THREE.Mesh(hullGeo, carbonMat)
  droneGroup.add(hullMesh)

  // Top Aerodynamic Canopy
  const canopyGeo = new THREE.ConeGeometry(0.75, 0.32, 4)
  const canopyMesh = new THREE.Mesh(canopyGeo, stealthMat)
  canopyMesh.rotation.y = Math.PI / 4
  canopyMesh.position.y = 0.3
  droneGroup.add(canopyMesh)

  // Status Beacon on top
  const beaconGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16)
  const beaconMesh = new THREE.Mesh(beaconGeo, accentLimeMat)
  beaconMesh.position.set(0, 0.48, 0)
  droneGroup.add(beaconMesh)

  // 2. Camera Gimbal Assembly (Tracks Mouse)
  const gimbalGroup = new THREE.Group()
  gimbalGroup.position.set(0, -0.16, 0.9)
  droneGroup.add(gimbalGroup)

  const gimbalBaseGeo = new THREE.SphereGeometry(0.24, 16, 16)
  const gimbalBase = new THREE.Mesh(gimbalBaseGeo, carbonMat)
  gimbalGroup.add(gimbalBase)

  const lensGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.2, 16)
  const lensMesh = new THREE.Mesh(lensGeo, stealthMat)
  lensMesh.rotation.x = Math.PI / 2
  lensMesh.position.z = 0.15
  gimbalGroup.add(lensMesh)

  const eyeGeo = new THREE.CircleGeometry(0.08, 16)
  const eyeMesh = new THREE.Mesh(eyeGeo, lensGlowMat)
  eyeMesh.position.set(0, 0, 0.26)
  gimbalGroup.add(eyeMesh)

  // 3. Four Symmetrical Diagonal Carbon Arms
  const armCoords = [
    { x: -1.4, z: -1.4, isFront: false, isLeft: true },
    { x: 1.4, z: -1.4, isFront: false, isLeft: false },
    { x: -1.4, z: 1.4, isFront: true, isLeft: true },
    { x: 1.4, z: 1.4, isFront: true, isLeft: false }
  ]

  const propellers = []

  armCoords.forEach((coord) => {
    // Arm strut
    const armLength = Math.sqrt(coord.x * coord.x + coord.z * coord.z)
    const armAngle = Math.atan2(coord.x, coord.z)
    
    const armGeo = new THREE.BoxGeometry(0.15, 0.1, armLength)
    const armMesh = new THREE.Mesh(armGeo, carbonMat)
    armMesh.position.set(coord.x / 2, 0, coord.z / 2)
    armMesh.rotation.y = armAngle
    droneGroup.add(armMesh)

    // Motor Mount Base
    const motorBaseGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.2, 16)
    const motorBase = new THREE.Mesh(motorBaseGeo, carbonMat)
    motorBase.position.set(coord.x, 0.08, coord.z)
    droneGroup.add(motorBase)

    // Copper stator ring
    const statorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16)
    const stator = new THREE.Mesh(statorGeo, copperMat)
    stator.position.set(coord.x, 0.14, coord.z)
    droneGroup.add(stator)

    // Arm tip navigation strobe LED
    const ledGeo = new THREE.SphereGeometry(0.05, 12, 12)
    const ledMat = coord.isFront ? ledGreenMat : ledRedMat
    const led = new THREE.Mesh(ledGeo, ledMat)
    led.position.set(coord.x * 1.12, 0.04, coord.z * 1.12)
    droneGroup.add(led)

    // Propeller Assembly
    const propGroup = new THREE.Group()
    propGroup.position.set(coord.x, 0.24, coord.z)
    droneGroup.add(propGroup)

    // Propeller Hub
    const propHubGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.1, 12)
    const propHub = new THREE.Mesh(propHubGeo, stealthMat)
    propGroup.add(propHub)

    // Two Aerodynamic Blades
    const bladeGeo = new THREE.BoxGeometry(1.35, 0.02, 0.12)
    const bladeMesh = new THREE.Mesh(bladeGeo, stealthMat)
    propGroup.add(bladeMesh)

    // Semi-transparent spinning prop blur disk
    const discGeo = new THREE.CircleGeometry(0.72, 24)
    const discMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    })
    const discMesh = new THREE.Mesh(discGeo, discMat)
    discMesh.rotation.x = Math.PI / 2
    discMesh.position.y = 0.02
    propGroup.add(discMesh)

    propellers.push({
      group: propGroup,
      dir: (coord.isFront === coord.isLeft) ? 1 : -1,
      speed: 0.45 + Math.random() * 0.05
    })
  })

  // 4. Landing Skids (Legs)
  const skidMat = stealthMat
  ;[-0.75, 0.75].forEach(x => {
    const skidGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.8, 12)
    const skid = new THREE.Mesh(skidGeo, skidMat)
    skid.rotation.x = Math.PI / 2
    skid.position.set(x, -0.55, 0)
    droneGroup.add(skid)

    // Vertical struts
    ;[-0.55, 0.55].forEach(z => {
      const strutGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.38, 8)
      const strut = new THREE.Mesh(strutGeo, skidMat)
      strut.position.set(x, -0.32, z)
      droneGroup.add(strut)
    })
  })

  // 5. Contact Shadow (Soft Feathered Radial Drop Shadow)
  const shadowCanvas = document.createElement("canvas")
  shadowCanvas.width = 128
  shadowCanvas.height = 128
  const sCtx = shadowCanvas.getContext("2d")
  const gradient = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.18)")
  gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.05)")
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
  sCtx.fillStyle = gradient
  sCtx.fillRect(0, 0, 128, 128)

  const shadowTex = new THREE.CanvasTexture(shadowCanvas)
  const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6)
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false
  })
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
  shadowMesh.rotation.x = -Math.PI / 2
  shadowMesh.position.y = -1.8
  scene.add(shadowMesh)

  // Interaction State
  let mouseX = 0
  let mouseY = 0
  let targetX = 0
  let targetY = 0

  let isDragging = false
  let prevPointerX = 0
  let prevPointerY = 0
  let manualRotX = 0.2
  let manualRotY = -0.4

  const onPointerMove = (e) => {
    const rect = container.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)

    targetX = Math.max(-1, Math.min(1, x))
    targetY = Math.max(-1, Math.min(1, y))

    if (isDragging) {
      const deltaX = e.clientX - prevPointerX
      const deltaY = e.clientY - prevPointerY
      manualRotY += deltaX * 0.008
      manualRotX += deltaY * 0.008
      prevPointerX = e.clientX
      prevPointerY = e.clientY
    }
  }

  const onPointerDown = (e) => {
    isDragging = true
    prevPointerX = e.clientX
    prevPointerY = e.clientY
  }

  const onPointerUp = () => {
    isDragging = false
  }

  window.addEventListener("pointermove", onPointerMove)
  canvas.addEventListener("pointerdown", onPointerDown)
  window.addEventListener("pointerup", onPointerUp)

  // Robust Resize Handler with sync
  const updateSize = () => {
    const size = getSize()
    if (size.w === 0 || size.h === 0) return
    camera.aspect = size.w / size.h
    camera.updateProjectionMatrix()
    renderer.setSize(size.w, size.h, false)
  }

  window.addEventListener("resize", updateSize)

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => {
      updateSize()
    })
    ro.observe(container)
  }

  // Animation Loop
  let clock = new THREE.Clock()

  const animate = () => {
    requestAnimationFrame(animate)

    const delta = clock.getDelta()
    const elapsed = clock.getElapsedTime()

    // High-speed propeller rotation
    propellers.forEach(p => {
      p.group.rotation.y += p.dir * p.speed
    })

    // Smooth mouse interpolation
    mouseX += (targetX - mouseX) * 0.06
    mouseY += (targetY - mouseY) * 0.06

    // Realistic Aerodynamic Drone Hovering Physics
    const hoverY = Math.sin(elapsed * 2.8) * 0.18 + Math.cos(elapsed * 4.4) * 0.04
    const hoverBank = Math.sin(elapsed * 1.9) * 0.03
    const hoverPitch = Math.cos(elapsed * 2.3) * 0.03

    droneGroup.position.y = hoverY
    shadowMesh.scale.setScalar(1 - hoverY * 0.1)

    // Combine manual drag rotation with aerodynamic banking toward mouse
    const leanRoll = -mouseX * 0.3 + hoverBank
    const leanPitch = mouseY * 0.22 + hoverPitch

    droneGroup.rotation.y = manualRotY + mouseX * 0.22
    droneGroup.rotation.x = manualRotX + leanPitch
    droneGroup.rotation.z = leanRoll

    // Camera gimbal follows cursor
    gimbalGroup.rotation.y = mouseX * 0.5
    gimbalGroup.rotation.x = -mouseY * 0.45

    renderer.render(scene, camera)
  }

  animate()
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init3DDrone)
} else {
  init3DDrone()
}




