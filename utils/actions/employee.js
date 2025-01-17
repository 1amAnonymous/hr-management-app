import { supabase } from "@/lib/supabase";

export const addEmployee = async (formData) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const role = formData.get("role");
  const phone = formData.get("phone");
  const department = formData.get("department");
  const doj = formData.get("doj");
  const cv = formData.get("cv");
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
      })
      .select();
    if (error) {
      return { data: employeeData, error: error };
    } else if (employeeData?.length > 0) {
      const employeeId = employeeData[0].id;
      const { data, error } = await supabase.storage
        .from("cv")
        .update(`${employeeId}.pdf`, cv, {
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
    .download(`${employeeId}.pdf`);
  return { data, error };
};
