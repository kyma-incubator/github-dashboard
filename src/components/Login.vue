<template>
  <a :href="loginLink">Login</a>
</template>

<script>
import router from '../router.js'
export default {
  name: 'Login',
  props: {
    msg: String
  },
  setup(props, context) {
    const { getRoutes } = router
    const authorizePath = getRoutes().filter(route => route.name ==="Authorize")[0].path;
    const rootUrl = import.meta.env.VITE_ROOT_URL;
    let loginLink = [
        `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_APP_ID}`,
        `scope=read:user`,
        `redirect_uri=${rootUrl}${authorizePath}`,
        `allow_signup=false`
      ].join('&')
    return {
      loginLink
    }
  }

}
</script>
