import { supabase } from "@/lib/supabase";

export const createLeave = async (formData)=>{
    const hrId = (await supabase.auth.getUser()).data.user.id;
    const name = formData.get("name");
    const from = formData.get("from");
    const to = formData.get("to");
    if(hrId){
        const { data, error } = await supabase.from("leaves").insert({name, from, to, hrId});
        return { data, error };
    }else{
        return { data: [], error: new Error("User not found") };
    }
}

export const getLeaves = async ()=>{
    const hrId = (await supabase.auth.getUser()).data.user.id;
    if(hrId){
        const { data, error } = await supabase
        .from("leaves")
        .select("*")
        .eq("hrId", hrId)
        .order("from", { ascending: true });
        return { data, error };
    }else{
        return { data: [], error: new Error("User not found") };
    }
}

export const deleteLeave = async (id)=>{
    const hrId = (await supabase.auth.getUser()).data.user.id;
    if(hrId){
        const { data, error } = await supabase.from("leaves").delete().eq("id", id).eq("hrId", hrId);
        return { data, error };
    }else{
        return { data: [], error: new Error("User not found") };
    }
}