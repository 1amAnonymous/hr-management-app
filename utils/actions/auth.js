import { supabase } from "@/lib/supabase";

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signup = async (formData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");
  const phone = formData.get("phone");
  const profilePic = formData.get("profilePic");

  const { data, error } = await supabase.auth.signUp({ email, password });
//   console.log(data,"signupData")
  if(error){
    return { data: data, error: error };
  }
  const UID = data.user.id;
  if (data) {
    const { data: hrData, error: hrError } = await supabase
      .from("hrList")
      .select("*")
      .eq("UID", UID);
    if (hrData.length === 0) {
      const { data, error } = await supabase
        .from("hrList")
        .insert({ name, email, phone, UID });
      if (error) {
        console.log(error);
        return { data, error };
      }
    } else {
      const { data, error } = await supabase
        .from("hrList")
        .update({ name, email, phone })
        .eq("UID", UID);
      if (error) {
        console.log(error);
        return { data, error };
      }
    }

    const { data: storageData, error: storageError } = await supabase.storage
      .from("profile_pic")
      .update(`${UID}.png`, profilePic, {
        cacheControl: "3600",
        upsert: false,
      });
    console.log(storageData, storageError);
    if (storageError) {
      return { data: storageData, error: storageError };
    }
  }

  return { data, error };
};
