<template>
  <div>
  <h1>{{ msg }}</h1>
  <button v-on:click="sendReply">reply</button>
    </div>
</template>
<script>
export default {
  name: 'HelloWorld', //name of the component
  props: {
    msg: String
  },
  methods: {
    sendReply() {
      this.$emit('reply', 'Hello from child!')
    }
  }
}
</script>