const { createApp } = Vue;

createApp({
  data() {
    return {
      category: '',
      apiKey: '', // เพิ่มตัวแปร apiKey
      flashcards: [],
      loading: false
    };
  },
  methods: {
    async generateFlashcards() {
      if (!this.category || !this.apiKey) return; // ต้องกรอกทั้ง category และ apiKey

      this.loading = true;
      try {
        const response = await fetch("https://n8n.nocnoc-internal.com/webhook/generate-flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey // ใช้ apiKey ที่ user กรอก
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
