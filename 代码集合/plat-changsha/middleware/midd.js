export default function ({ route, redirect }) {
    if (route.path == '/graphic-content' || route.path == '/article-list' || route.path == '/graphic-list' || route.path == '/picture-list' || route.path == '/aboutWT') {
        redirect({ path: process.env.PC_URL + route.path, query: route.query });
    }
    if(!route.matched.length){
        redirect('/404')
    }
}