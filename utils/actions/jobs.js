import { supabase } from "@/lib/supabase";

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
