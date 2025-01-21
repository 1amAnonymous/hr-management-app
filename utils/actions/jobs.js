import { supabase } from "@/lib/supabase";
import { getResp } from "../helper/aiREsponse";

export const adminPostJobs = async (formData) => {
  const role = formData.get("role");
  const company = formData.get("company");
  const location = formData.get("location");
  const responsibilities = formData.get("responsibilities");
  const salary = formData.get("salary");
  const hrid = (await supabase.auth.getUser()).data.user.id;
  if (hrid) {
    const { data, error } = await supabase
      .from("jobs")
      .insert({ role, company, location, responsibilities, salary, hrid });
    return { data, error };
  } else {
    return { data: [], error: new Error("User not found") };
  }
};

export const adminGetJobs = async () => {
  const hrid = (await supabase.auth.getUser()).data.user.id;
  if (hrid) {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("hrid", hrid);
    return { data, error };
  } else {
    return { data: [], error: new Error("User not found") };
  }
};

export const getSingleJob = async (jobId) => {
  const hrid = (await supabase.auth.getUser()).data.user.id;
  if (hrid) {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .eq("hrid", hrid);
    return { data, error };
  } else {
    return { data: [], error: new Error("User not found") };
  }
};


export const updateJob = async (formData) => {
  const role = formData.get("role");
  const company = formData.get("company");
  const location = formData.get("location");
  const responsibilities = formData.get("responsibilities");
  const salary = formData.get("salary");
  const jobId = formData.get("jobId");
  const hrid = (await supabase.auth.getUser()).data.user.id;
  if (hrid) {
    const { data, error } = await supabase
      .from("jobs")
      .update({ role, company, location, responsibilities, salary })
      .eq("id", jobId)
      .eq("hrid", hrid);
    return { data, error };
  } else {
    return { data: [], error: new Error("User not found") };
  }
};

export const deleteJob = async (jobId) => {
  const hrid = (await supabase.auth.getUser()).data.user.id;
  if (hrid) {
    const { data, error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobId)
      .eq("hrid", hrid);
    return { data, error };
  } else {
    return { data: [], error: new Error("User not found") };
  }
}

export const getPublicJobs = async () => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*");
  return { data, error }
}

export const getSinglePublicJob = async (jobId) => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId);
  return { data, error }
}

export const publicApplyJobs = async (formData) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const jobId = formData.get("jobid");
  const hrId = formData.get("hrId");
  const cv = formData.get("cv");
  let profileDetails = formData.get("profileDetails");
  const resp = await getResp(profileDetails);
  profileDetails = JSON.stringify(resp);
  console.log(profileDetails)
  const { data:applicantData, error: applicantError } = await supabase
    .from("applications")
    .insert({ name, email, phone, jobId, hrId, profileDetails }).select();
  if(!applicantError){
    if (cv) {
      const { data, error } = await supabase.storage
        .from("cv")
        .update(`${applicantData[0].id}`, cv, {
          cacheControl: "3600",
          upsert: true,
        });
      return { data, error };
    }
  }
  return { applicantData, applicantError }
}