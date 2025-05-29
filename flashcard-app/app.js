const { createApp } = Vue;

createApp({
  data() {
    return {
      category: '',
      flashcards: [],
      loading: false
    };
  },
  methods: {
    async generateFlashcards() {
      if (!this.category) return;

      this.loading = true;
      try {
        const response = await fetch("https://n8n.nocnoc-internal.com/webhook/generate-flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ category: this.category })
        });

        const data = await response.json();

        // สมมุติว่า n8n ตอบกลับด้วย array [{ word, definition }]
        this.flashcards = (Array.isArray(data) ? data : []).map(card => ({ ...card, flipped: false }));
      } catch (err) {
        alert("Error generating flashcards");
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    toggleCard(index) {
      this.flashcards[index].flipped = !this.flashcards[index].flipped;
    }
  }
}).mount("#app");
