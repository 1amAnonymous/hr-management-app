import { supabase } from "@/lib/supabase";

export const getAdminApplicants = async (jobId) => {
    const hrid = (await supabase.auth.getUser()).data.user.id;
    console.log(hrid,jobId)
    if(hrid) {
        const { data, error } = await supabase
        .from("applications")
        .select("*").eq("hrId", hrid).eq('jobId',jobId);
    return { data, error }
    }else{
        return { data: [], error: new Error("User not found") };
    }
};

export const getApplicants = async (applicantId) => {
    const hrid = (await supabase.auth.getUser()).data.user.id;
    if(hrid) {
        const { data, error } = await supabase
        .from("applications")
        .select("*").eq("id", applicantId).eq("hrId", hrid);
    return { data, error }
    }else{
        return { data: [], error: new Error("User not found") };
    }
};