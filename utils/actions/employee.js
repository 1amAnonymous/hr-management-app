import { supabase } from "@/lib/supabase";

export const addEmployee = async (formData) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const role = formData.get("role");
  const phone = formData.get("phone");
  const department = formData.get("department");
  const doj = formData.get("doj");
  const cv = formData.get("cv");
  const profileDetails = formData.get("profileDetails");
  const session = await supabase.auth.getUser();
  console.log(session, "addEmployee");
  if (session.data.user) {
    console.log("Asd");
    const { data: employeeData, error } = await supabase
      .from("employee")
      .insert({
        name,
        email,
        role,
        phone,
        department,
        doj,
        hr: session.data.user.id,
        profileDetails,
      })
      .select();
    if (error) {
      return { data: employeeData, error: error };
    } else if (employeeData?.length > 0) {
      const employeeId = employeeData[0].id;
      const { data, error } = await supabase.storage
        .from("cv")
        .update(`${employeeId}`, cv, {
          cacheControl: "3600",
          upsert: true,
        });
      console.log(data, error, "employee cv");
      return { data, error };
    }
    console.log(employeeData, error, "employeeData");
    return { data, error };
  } else {
    const { data, error } = session;
    return { data, error };
  }
};

export const getEmployeeData = async () => {
  const session = await supabase.auth.getUser();
  if (session.data.user) {
    const { data, error } = await supabase
      .from("employee")
      .select("*")
      .eq("hr", session.data.user.id);
    return { data, error };
  } else {
    return session;
  }
};

export const downloadCV = async (employeeId) => {
  const { data, error } = await supabase.storage
    .from("cv")
    .download(`${employeeId}`);
  return { data, error };
};

export const getEmployeeDetails = async (employeeId) => {
  const { data, error } = await supabase
    .from("employee")
    .select("*")
    .eq("id", employeeId);
  return { data, error };
};

export const getSingleEmployeeData = async (employeeId) => {
  const { data, error } = await supabase
    .from("employee")
    .select("*")
    .eq("id", employeeId);
  return { data, error };
};

export const updateEmployee = async (formData) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const role = formData.get("role");
  const phone = formData.get("phone");
  const department = formData.get("department");
  const doj = formData.get("doj");
  const profileDetails = formData.get("profileDetails");
  const cv = formData.get("cv");
  const employeeId = formData.get("employeeId");
  const updatedData = { name, email, role, phone, department, doj };
  if (profileDetails) {
    updatedData.profileDetails = profileDetails;
  }

  const { data, error } = await supabase
    .from("employee")
    .update(updatedData)
    .eq("id", employeeId);
  if (!error && cv) {
    const { data, error } = await supabase.storage
      .from("cv")
      .update(`${employeeId}`, cv, {
        cacheControl: "3600",
        upsert: true,
      });
     if(error) return { data, error }; 
  }
  return { data, error };
};


export const deleteEmployee = async (employeeId) => {
  const { data, error } = await supabase
    .from("employee")
    .delete()
    .eq("id", employeeId);
  if(!error) {
    const {data: cvData, error: cvError} = await supabase.storage.from("cv").remove(`${employeeId}`);
    if(cvError) return { cvData, cvError };
  }
  return { data, error };
};

export const searchEmployee = async (query) => {
  const hrId = (await supabase.auth.getUser()).data.user.id;
  if(!hrId) return { data: [], error: new Error("User not found") };
  const { data, error } = await supabase
      .from('employee')
      .select('*')
      .or(
        `name.ilike.%${query}%,email.ilike.%${query}%,role.ilike.%${query}%,department.ilike.%${query}%`
      ).eq('hr', hrId);
  return { data, error };
}
