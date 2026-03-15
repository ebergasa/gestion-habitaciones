import { createRouter, createWebHashHistory } from 'vue-router'
import PlanoView from '../views/PlanoView.vue'
import ResidentesView from '../views/ResidentesView.vue'
import HistorialView from '../views/HistorialView.vue'
import InsightsView from '../views/InsightsView.vue'
import BuscadorView from '../views/BuscadorView.vue'
import ConfigView from '../views/ConfigView.vue'

const routes = [
  { path: '/', redirect: '/plano' },
  { path: '/plano', component: PlanoView },
  { path: '/residentes', component: ResidentesView },
  { path: '/historial', component: HistorialView },
  { path: '/insights', component: InsightsView },
  { path: '/buscar', component: BuscadorView },
  { path: '/config', component: ConfigView }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
