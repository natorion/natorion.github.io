<template>
  <div v-if="visible" class="cookie-banner">
    <div class="cookie-banner-content">
      <p>
        This site uses cookies for analytics (Google Analytics) to understand how visitors use the site.
        See the <a href="/datenschutz">Privacy Policy</a> for details.
      </p>
      <div class="cookie-banner-buttons">
        <button class="cookie-btn cookie-btn-reject" @click="reject">Reject</button>
        <button class="cookie-btn cookie-btn-accept" @click="accept">Accept</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(false)
const GA_ID = 'G-ZQM6C2G2DQ'

function getConsent() {
  try {
    return localStorage.getItem('cookie-consent')
  } catch {
    return null
  }
}

function setConsent(value) {
  try {
    localStorage.setItem('cookie-consent', value)
  } catch {
    // storage unavailable
  }
}

function loadGA() {
  if (document.querySelector(`script[src*="gtag"]`)) return
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  gtag('js', new Date())
  gtag('config', GA_ID)
}

function accept() {
  setConsent('accepted')
  visible.value = false
  loadGA()
}

function reject() {
  setConsent('rejected')
  visible.value = false
}

onMounted(() => {
  const consent = getConsent()
  if (consent === 'accepted') {
    loadGA()
  } else if (consent === null) {
    visible.value = true
  }
})
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-border);
  padding: 16px 24px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.cookie-banner-content {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cookie-banner-content p {
  margin: 0;
  flex: 1;
  min-width: 200px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.cookie-banner-content a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.cookie-banner-buttons {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.cookie-btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--vp-c-border);
  transition: background-color 0.2s, border-color 0.2s;
}

.cookie-btn-reject {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}

.cookie-btn-reject:hover {
  background: var(--vp-c-bg-soft);
}

.cookie-btn-accept {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  border-color: var(--vp-c-brand-1);
}

.cookie-btn-accept:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}
</style>
