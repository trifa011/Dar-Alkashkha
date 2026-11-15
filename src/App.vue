<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import SocialLinks from './components/SocialLinks.vue'
import FeedbackForm from './components/FeedbackForm.vue'
import FeedbackList from './components/FeedbackList.vue'
import Footer from './components/Footer.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import { useFeedback } from './composables/useFeedback'
import { useLanguage } from './composables/useLanguage'

const feedback = useFeedback()
const { t } = useLanguage()

onMounted(() => {
  feedback.loadFirstPage()
})
</script>

<template>
  <Navbar />
  <main>
    <HeroSection />
    <AboutSection />
    <SocialLinks />

    <section id="feedback" class="section feedback" aria-labelledby="feedback-title">
      <div class="container">
        <header class="section__header">
          <p class="eyebrow">{{ t('feedback.eyebrow') }}</p>
          <h2 id="feedback-title" class="section__title">{{ t('feedback.title') }}</h2>
        </header>

        <div class="feedback__layout">
          <div class="feedback__form-wrap">
            <FeedbackForm :on-submit="feedback.submit" :is-submitting="feedback.isSubmitting.value" />
          </div>

          <div class="feedback__list-wrap">
            <h3 class="feedback__list-title">{{ t('feedback.listTitle') }}</h3>
            <FeedbackList
              :items="feedback.items.value"
              :has-loaded="feedback.hasLoaded.value"
              :is-loading="feedback.isLoading.value"
              :is-loading-more="feedback.isLoadingMore.value"
              :has-more="feedback.hasMore.value"
              :error="feedback.loadError.value"
              @retry="feedback.loadFirstPage"
              @load-more="feedback.loadMore"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
  <Footer />
  <LanguageSwitcher />
</template>