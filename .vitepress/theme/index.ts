import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'
import AuroraBackground from './components/AuroraBackground.vue'
import AnimatedTitle from './components/AnimatedTitle.vue'
import ProjectCard from './components/ProjectCard.vue'
import GlowCard from './components/GlowCard.vue'
import ScrollReveal from './components/ScrollReveal.vue'
import ExternumPlayground from './components/ExternumPlayground.vue'
import PdfBookViewer from './components/PdfBookViewer.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AuroraBackground', AuroraBackground)
    app.component('AnimatedTitle', AnimatedTitle)
    app.component('ProjectCard', ProjectCard)
    app.component('GlowCard', GlowCard)
    app.component('ScrollReveal', ScrollReveal)
    app.component('ExternumPlayground', ExternumPlayground)
    app.component('PdfBookViewer', PdfBookViewer)
  },
} satisfies Theme
