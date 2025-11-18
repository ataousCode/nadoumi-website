import React from 'react'
import AboutHero from '../component/about/AboutHero.jsx'
import FounderMessage from '../component/about/FounderMessage.jsx'
import MissionVion from '../component/about/MissionVion.jsx'
import Team from '../component/about/Team.jsx'
import Value from '../component/about/Value.jsx'
import RecentActivity from '../component/about/RecentActivity.jsx'
import { useI18n } from '../i18n/LocaleProvider.jsx'

function About() {
  const { t } = useI18n()
  return (
    <>
      <AboutHero imageSrc="team1.jpg" fit="cover" position="center 30%" title={t('about.hero.title')} highlight={t('about.hero.highlight')} description={t('about.hero.description')} />
      <FounderMessage title={t('about.founder.title')} />
      <MissionVion missionTitle={t('about.mission.title')} missionText={t('about.mission.text')} visionTitle={t('about.vision.title')} visionText={t('about.vision.text')} promiseTitle={t('about.promise.title')} promiseText={t('about.promise.text')} />
      <Team title={t('about.team.title')} subtitle={t('about.team.subtitle')} />
      <RecentActivity title={t('about.recent.title')} />
      <Value title={t('about.values.title')} subtitle={t('about.values.subtitle')} />
    </>
  )
}

export default About