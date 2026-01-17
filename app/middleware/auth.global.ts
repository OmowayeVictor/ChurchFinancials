export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()
  const { data, error } = await supabase.auth.getUser()

  const publicPages = ['/login', '/signup', '/reset']

//   if (!data?.user && !publicPages.includes(to.path)) {
//     return navigateTo('/login')
//   }

  if (data?.user && publicPages.includes(to.path)) {
    return navigateTo('/')
  }
})
