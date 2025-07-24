<template>
    <div>
        <h1>Login</h1>
        <form>
            <input type="text" v-model="email" placeholder="email">
            <input type="password" v-model="password" placeholder="Password">
            <button type="submit" @click.prevent="handleLogin">Login</button>
        </form>
    </div>
</template>

<script src="./Login.js"></script>

<style scoped src="./Login.css"></style>