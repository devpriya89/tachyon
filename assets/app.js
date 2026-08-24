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
      { label: "Website", url: "https://www.takumidelhi.com/" }
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
      { label: "Website", url: "https://aarohindia.com/" }
    ]
  },
  "build-guild": {
    title: "Build Guild Delhi",
    tag: "03 / Hardware Enthusiast Meetup",
    date: "Apr 18, 2025 • CP Delhi",
    body: "A one-day hardware enthusiast meetup at Pinnacle Space, Connaught Place, conducted as part of Hack Club Blueprint's global Build Guild week. 150 students aged 13-18 built with breadboards, microcontrollers, soldering, competitions, showcases, and hardware hackathon activities.",
    meta: [
      { label: "Participants", value: "150 Builders" },
      { label: "Partner", value: "Hack Club" },
      { label: "Age Group", value: "13 - 18" },
      { label: "Focus", value: "Hardware Hackathon" },
      { label: "Venue", value: "Connaught Place" }
    ],
    links: [
      { label: "Website", url: "https://buildguilddelhi.space/" }
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
    links: [
      { label: "Overview", url: "ventures.html#beyond-horizons" }
    ]
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
    links: [
      { label: "Platform Overview", url: "ventures.html#robotics" }
    ]
  },
  campfire: {
    title: "Campfire Delhi",
    tag: "07 / Community & Sprint",
    date: "Collaborative Gathering • Delhi",
    body: "A collaborative community sprint and student builder gathering bringing together 100+ creators, organized in collaboration with Hack Club and Master's Union.",
    meta: [
      { label: "Participants", value: "100+ Builders" },
      { label: "Partner 01", value: "Hack Club" },
      { label: "Partner 02", value: "Master's Union" },
      { label: "Format", value: "Community Sprint" },
      { label: "City", value: "Delhi" }
    ],
    links: [
      { label: "Overview", url: "ventures.html#campfire" }
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
      { label: "Overview", url: "ventures.html#metamorphosis" }
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
    const email = String(data.get("email") || "").trim()
    const intent = String(data.get("intent") || "Collaboration").trim()
    const message = String(data.get("message") || "").trim()

    const subject = encodeURIComponent(`[Tachyon Inquiry] ${intent} - ${name}`)
    const body = encodeURIComponent(`Hi Tachyon Team,\n\nName: ${name}\nEmail: ${email}\nPrimary Intent: ${intent}\n\nMessage:\n${message}\n\n--\nSent via Tachyon Platform Contact Form`)
    const mailtoUrl = `mailto:tachyon.inquiry@gmail.com?subject=${subject}&body=${body}`

    if (note) {
      note.style.color = "#11110f"
      note.style.fontWeight = "600"
      note.innerHTML = `✓ Request formatted for <strong>tachyon.inquiry@gmail.com</strong>. Opening your email client... If it doesn't open automatically, <a href="${mailtoUrl}" style="text-decoration: underline; font-weight: 800; color: #ff5c2b;">click here to send email</a>.`
    }

    window.setTimeout(() => {
      window.location.href = mailtoUrl
    }, 400)

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

  const getSize = () => {
    const rect = container.getBoundingClientRect()
    return {
      w: rect.width || container.clientWidth || 400,
      h: rect.height || container.clientHeight || 400
    }
  }

  let { w, h } = getSize()

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 1000)
  camera.position.set(0, 1.25, 18)
  camera.lookAt(0, 0.4, 0)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  })
  renderer.setSize(w, h, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.05)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.15)
  dirLight.position.set(5, 10, 7)
  dirLight.castShadow = true
  scene.add(dirLight)

  const rimLight = new THREE.DirectionalLight(0x4d7cff, 0.9)
  rimLight.position.set(-8, 2, -8)
  scene.add(rimLight)

  const fillLight = new THREE.PointLight(0x2fe6ff, 0.55, 18)
  fillLight.position.set(-3, 1.5, 4)
  scene.add(fillLight)

  const accentLight = new THREE.PointLight(0xdfff32, 0.7, 12)
  accentLight.position.set(0, 2, 0)
  scene.add(accentLight)

  const droneGroup = new THREE.Group()
  droneGroup.scale.set(1.15, 1.15, 1.15)
  scene.add(droneGroup)

  const shadowCanvas = document.createElement("canvas")
  shadowCanvas.width = 128
  shadowCanvas.height = 128
  const sCtx = shadowCanvas.getContext("2d")
  const gradient = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.18)")
  gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.06)")
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
  sCtx.fillStyle = gradient
  sCtx.fillRect(0, 0, 128, 128)

  const shadowTex = new THREE.CanvasTexture(shadowCanvas)
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  })
  const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), shadowMat)
  shadowMesh.rotation.x = -Math.PI / 2
  shadowMesh.position.y = -2.2
  scene.add(shadowMesh)

  let mouseX = 0
  let mouseY = 0
  let targetX = 0
  let targetY = 0
  let isDragging = false
  let prevPointerX = 0
  let prevPointerY = 0
  let manualRotX = 0.2
  let manualRotY = -0.4

  const onPointerMove = (event) => {
    const rect = container.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)

    targetX = Math.max(-1, Math.min(1, x))
    targetY = Math.max(-1, Math.min(1, y))

    if (isDragging) {
      const deltaX = event.clientX - prevPointerX
      const deltaY = event.clientY - prevPointerY
      manualRotY += deltaX * 0.008
      manualRotX += deltaY * 0.008
      prevPointerX = event.clientX
      prevPointerY = event.clientY
    }
  }

  const onPointerDown = (event) => {
    isDragging = true
    prevPointerX = event.clientX
    prevPointerY = event.clientY
  }

  const onPointerUp = () => {
    isDragging = false
  }

  window.addEventListener("pointermove", onPointerMove)
  canvas.addEventListener("pointerdown", onPointerDown)
  window.addEventListener("pointerup", onPointerUp)

  const updateSize = () => {
    const size = getSize()
    if (size.w === 0 || size.h === 0) return
    camera.aspect = size.w / size.h
    camera.updateProjectionMatrix()
    renderer.setSize(size.w, size.h, false)
  }

  window.addEventListener("resize", updateSize)

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => updateSize())
    ro.observe(container)
  }

  let loadedDrone = null

  const objLoader = typeof THREE.OBJLoader === "function" ? new THREE.OBJLoader() : null

  if (objLoader) {
    objLoader.load(
      "assets/drone.obj",
      (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            const mat = new THREE.MeshPhysicalMaterial({
              color: 0x111827,
              emissive: 0x0f172a,
              metalness: 0.85,
              roughness: 0.22,
              clearcoat: 0.7,
              clearcoatRoughness: 0.2,
              side: THREE.DoubleSide
            })
            child.material = mat
          }
        })

        const box = new THREE.Box3().setFromObject(object)
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        const scale = 10 / maxDim

        object.scale.setScalar(scale)
        object.rotation.set(0, Math.PI * 0.75, -0.12)
        object.position.set(0.2, 0.2, 0.15)
        object.name = "droneModel"

        droneGroup.add(object)
        loadedDrone = object
      },
      undefined,
      (error) => {
        console.error("Drone model failed to load:", error)
      }
    )
  } else {
    console.warn("OBJLoader not available; using fallback drone styling.")
  }

  let clock = new THREE.Clock()

  const animate = () => {
    requestAnimationFrame(animate)
    const elapsed = clock.getElapsedTime()

    mouseX += (targetX - mouseX) * 0.06
    mouseY += (targetY - mouseY) * 0.06

    const hoverY = Math.sin(elapsed * 2.5) * 0.2 + Math.cos(elapsed * 4.3) * 0.04
    const hoverBank = Math.sin(elapsed * 1.8) * 0.04
    const hoverPitch = Math.cos(elapsed * 2.1) * 0.04

    droneGroup.position.y = hoverY + 0.1
    shadowMesh.scale.setScalar(1.25 - hoverY * 0.12)

    const leanRoll = -mouseX * 0.32 + hoverBank
    const leanPitch = mouseY * 0.2 + hoverPitch

    droneGroup.rotation.y = manualRotY + mouseX * 0.35
    droneGroup.rotation.x = manualRotX + leanPitch
    droneGroup.rotation.z = leanRoll

    if (loadedDrone) {
      loadedDrone.rotation.y += 0.006
      loadedDrone.rotation.z = -0.08 + Math.sin(elapsed * 1.5) * 0.06
    }

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




