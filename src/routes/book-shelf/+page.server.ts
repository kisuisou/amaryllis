import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { PUBLIC_API_ORIGIN } from "$env/static/public";

let res: {
    "user_id": string
}
export const load: PageServerLoad = async ({fetch}) => {
    const req = await fetch(PUBLIC_API_ORIGIN + "/signin");

    if(req.status == 403){
        redirect(301, "/signin");
    }
    else {
        res = await req.json();
        return {user_id: res.user_id};
    }

}