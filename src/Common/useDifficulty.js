import { ref } from 'vue'

const difficulty = ref(localStorage.getItem('dealer-difficulty') || 'easy')

export function useDifficulty() {
  function setDifficulty(val) {
    difficulty.value = val
    localStorage.setItem('dealer-difficulty', val)
  }

  return { difficulty, setDifficulty }
}
