export default defineNuxtRouteMiddleware((to, from) => {
    console.log("🚀 ~ defineNuxtRouteMiddleware ~ to:", to.name)
    
    const token = useCookie('accessToken');
    if (!token.value) return navigateTo('/login');
})
