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
    tag: "03 / Hardware & PCB",
    date: "Apr 18, 2025 • CP Delhi",
    body: "A one-day hardware meetup at Pinnacle Space, Connaught Place, conducted as part of Hack Club Blueprint's global Build Guild week. Students aged 13-18 built with breadboards, PCBs, soldering, competitions, showcases, and community activities.",
    meta: [
      { label: "Partner", value: "Hack Club" },
      { label: "Age Group", value: "13 - 18" },
      { label: "Focus", value: "PCB & Soldering" },
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
  metamorphosis: {
    title: "Metamorphosis",
    tag: "05 / IIT Delhi",
    date: "Campus Venture • IIT Delhi",
    body: "A teammate-led initiative that happened at IIT Delhi in collaboration with IITD. It sits in the archive as a connected team venture and proof of Tachyon's broader student network.",
    meta: [
      { label: "Location", value: "IIT Delhi" },
      { label: "Type", value: "Team-led" },
      { label: "Network", value: "Campus Ecosystem" }
    ],
    links: [
      { label: "Media Archive", url: "https://drive.google.com/drive/folders/1bm8WlXUhC-PBbkCQ1u3LrhPAwNSaoEt3" }
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

