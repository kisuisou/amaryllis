import { redirect } from "@sveltejs/kit";
import { page } from "$app/state";
import type { PageServerLoad } from "./$types";
import { PUBLIC_API_ORIGIN } from "$env/static/public";

let res: {
    "user_id": string,
    "page_num_now": number,
    "sort_order": string,
}
export const load: PageServerLoad = async ({fetch, url}) => {
    const req = await fetch(PUBLIC_API_ORIGIN + "/signin");

    if(req.status == 403){
        redirect(301, "/signin");
    }
    else {
        let page_num_str = url.searchParams.get("page_num");
        let page_num_now = page_num_str == null ? 1 : Number(page_num_str)
        page_num_now = page_num_now == undefined ?  1 : page_num_now;
        let sort_order = url.searchParams.get("sort_order")
        sort_order = sort_order == undefined ? "1" : sort_order;
        res = await req.json();
        return {user_id: res.user_id, page_num_now: page_num_now, sort_order: sort_order};
    }

}