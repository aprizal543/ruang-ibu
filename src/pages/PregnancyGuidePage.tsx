import MaternityGuidePage from '../components/guides/MaternityGuidePage'
import { maternityGuides } from '../content/maternityGuides'

export default function PregnancyGuidePage() {
  return <MaternityGuidePage guide={maternityGuides.pregnancy} />
}
