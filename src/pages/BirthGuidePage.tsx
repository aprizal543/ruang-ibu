import MaternityGuidePage from '../components/guides/MaternityGuidePage'
import { maternityGuides } from '../content/maternityGuides'

export default function BirthGuidePage() {
  return <MaternityGuidePage guide={maternityGuides.birth} />
}
