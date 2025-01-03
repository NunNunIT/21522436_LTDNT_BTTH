import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { X } from "@/lib/icons";
import Carousel from "@/components/carousel/type1";
import ImageUploadType1 from "@/components/imageUpload/type1";
import { Plus } from "@/lib/icons";
import {
  Colors,
  SegmentedControl,
  SegmentedControlItemProps,
  TextField,
} from "react-native-ui-lib";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import SingleChoicePicker from "@/components/select/oneChoice";
import { useColorScheme } from "nativewind";
import { useAuth } from "@/provider/AuthProvider";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import Spinner from "react-native-loading-spinner-overlay";
import { bindAll } from "lodash";
// import { fbApp, uploadToFireBase } from "@/firebase";
import MultiChoicePicker from "@/components/select/multiChoice";

// console.log(fbApp)

const { width } = Dimensions.get("window");

const segments: Record<string, Array<SegmentedControlItemProps>> = {
  first: [{ label: "Hình ảnh" }, { label: "Xem trước" }],
};

export const GENDER_OPTIONS = [
  { label: "Nam", value: "male" },
  { label: "Nữ", value: "female" },
  { label: "Khác", value: "other" },
] as const;

export default function FilterScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { session, profile, getProfile } = useAuth();
  const [name, setName] = useState<string>(profile?.name ?? "");
  const [gender, setGender] = useState<string>(profile?.gender ?? "other");
  const [age, setAge] = useState<string>(profile?.age?.toString() ?? "");
  const [bio, setBio] = useState<string>(profile?.bio ?? "");
  const [imgs, setImgs] = useState<string[]>([]);
  const [tab, setTab] = useState(0);
  const [hobbies, setHobbies] = useState<string[]>(profile?.hobbies ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirtyFields, setIsDirtyFields] = useState(false);

  useEffect(() => {
    const isDirty =
      JSON.stringify({ name, gender, age, bio, imgs, hobbies }) !==
      JSON.stringify({
        name: profile?.name,
        gender: profile?.gender,
        age: profile?.age?.toString(),
        bio: profile?.bio,
        imgs: profile?.imgs,
        hobbies: profile?.hobbies,
      });
    setIsDirtyFields(isDirty);
  }, [profile, setIsDirtyFields, name, gender, bio, age, bindAll, imgs]);

  useEffect(() => {
    if (!profile) return;
    setName(profile?.name ?? "");
    setGender(profile?.gender ?? "other");
    setAge(profile?.age?.toString() ?? "");
    setBio(profile?.bio ?? "");
    setImgs(profile?.imgs ?? []);
    setHobbies(profile?.hobbies ?? []);
  }, [profile]);

  const onChangeIndex = useCallback((index: number) => {
    console.warn(
      "Index " + index + " of the second segmentedControl was pressed"
    );
    setTab(index);
  }, []);

  const [screenPreset, setScreenPreset] = useState(
    SegmentedControl.presets.DEFAULT
  );

  const submitHandler = async () => {
    if (!session) return;
    setIsSubmitting(true);
    try {
      // console.log("imgs", imgs)
      // const imgsFirebase = await uploadToFireBase(imgs[0], "haha");
      // console.log("imgsFirebase", imgsFirebase)

      // 2. Chuẩn bị dữ liệu người dùng
      const userData = {
        name,
        age: Number(age),
        bio,
        gender,
        imgs: imgs, // imgsFirebase
        hobbies,
        user_id: session.user.id,
      };

      await supabase
        .from("profiles")
        .upsert(userData, { onConflict: "user_id" });
      await getProfile?.();
      setIsSubmitting(false);
      router.back();
    } catch (error) {
      // console.error("Error submitting data:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CustomThumb = () => {
    return (
      <View className="!size-6 rounded-full shadow-2xl shadow-pri-color border-3 border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-white">
        <Text></Text>
      </View>
    );
  };

  const onDelete = (indexToRemove: number) => {
    setImgs((prevImgs) =>
      prevImgs.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-5">
        <View className="h-full p-4 gap-4 flex flex-col mb-16">
          <TextField
            label="Tên của bạn"
            labelStyle={{
              fontSize: 16,
              color: colorScheme === "dark" ? "white" : "black",
              fontWeight: 800,
              paddingVertical: 3,
              paddingHorizontal: 12,
            }}
            placeholder={"Nhập tên của bạn"}
            placeholderTextColor="gray"
            floatingPlaceholderStyle={{
              fontSize: 16,
              color: colorScheme === "dark" ? "white" : "black",
              fontWeight: 800,
              paddingBottom: 2,
            }}
            color={colorScheme === "dark" ? "white" : "black"}
            enableErrors
            validateOnChange
            validate={["required"]}
            validationMessage={["Tên không được để trống"]}
            validationMessageStyle={{
              fontSize: 12,
              paddingVertical: 3,
              paddingHorizontal: 12,
            }}
            // showCharCounter
            maxLength={30}
            containerStyle={{
              width: "100%",
            }}
            fieldStyle={{
              backgroundColor: colorScheme === "dark" ? "#18181b" : "#f4f4f5",
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: colorScheme === "dark" ? "#27272a" : "#e4e4e7",
            }}
            value={name}
            onChangeText={setName}
          />

          <View className="flex flex-row gap-6">
            <View className="flex-1 ">
              <Text className="pl-4 text-black dark:text-white font-bold text-lg mb-1">
                Giới tính
              </Text>
              <View className="px-6 py-4 flex justify-start items-start bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-full">
                <SingleChoicePicker
                  value={gender}
                  onChange={(value) => setGender(value as string)} // Ensure this matches the correct type
                  title="Chọn một"
                  placeholder="Chọn một giá trị"
                  options={[...GENDER_OPTIONS]}
                  useDialogDefault
                />
              </View>
            </View>

            <TextField
              keyboardType="numeric"
              label="Tuổi"
              labelStyle={{
                fontSize: 16,
                color: colorScheme === "dark" ? "white" : "black",
                fontWeight: 800,
                paddingVertical: 3,
                paddingHorizontal: 12,
              }}
              placeholder={"Tuổi"}
              placeholderTextColor="gray"
              floatingPlaceholderStyle={{
                fontSize: 16,
                color: colorScheme === "dark" ? "white" : "black",
                fontWeight: 800,
                paddingBottom: 2,
              }}
              color={colorScheme === "dark" ? "white" : "black"}
              // floatingPlaceholder
              // floatOnFocus
              value={age}
              onChangeText={setAge}
              enableErrors
              validateOnChange
              validate={[
                "required",
                (value) => Number(value) >= 18,
                (value) => Number(value) <= 100,
              ]}
              validationMessage={[
                "Tuổi không được để trống",
                "Tuổi phải lớn hơn 18",
                "Tuổi phải nhỏ hơn 100",
              ]}
              validationMessageStyle={{
                fontSize: 12,
                paddingVertical: 3,
                paddingHorizontal: 12,
              }}
              // showCharCounter
              maxLength={30}
              containerStyle={{
                flex: 1,
              }}
              fieldStyle={{
                backgroundColor: colorScheme === "dark" ? "#18181b" : "#f4f4f5",
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: colorScheme === "dark" ? "#27272a" : "#e4e4e7",
              }}
            />
          </View>

          <TextField
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            label="Giới thiệu bạn với mọi người"
            labelStyle={{
              fontSize: 16,
              color: colorScheme === "dark" ? "white" : "black",
              fontWeight: 800,
              paddingVertical: 3,
              paddingHorizontal: 12,
            }}
            placeholder={"Viết gì đó giới thiệu bạn với mọi người"}
            placeholderTextColor="gray"
            floatingPlaceholderStyle={{
              fontSize: 16,
              color: colorScheme === "dark" ? "white" : "black",
              fontWeight: 800,
              paddingBottom: 2,
            }}
            color={colorScheme === "dark" ? "white" : "black"}
            // floatingPlaceholder
            // floatOnFocus
            value={bio}
            onChangeText={setBio}
            enableErrors
            validateOnChange
            // validate={["required"]}
            // validationMessage={["Tên không được để trống"]}
            validationMessageStyle={{
              fontSize: 12,
              paddingVertical: 3,
              paddingHorizontal: 12,
            }}
            showCharCounter
            charCounterStyle={{
              paddingHorizontal: 12,
            }}
            maxLength={200}
            containerStyle={{
              width: "100%",
            }}
            fieldStyle={{
              height: 100,
              backgroundColor: colorScheme === "dark" ? "#18181b" : "#f4f4f5",
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: colorScheme === "dark" ? "#27272a" : "#e4e4e7",
            }}
          />

        </View>
      </ScrollView>
      {/* Nút Submit */}
      <Button
        onPress={submitHandler}
        className="m-4 rounded-full z-50"
        disabled={!isDirtyFields || isSubmitting}
        variant="red"
      >
        <Text>Lưu</Text>
      </Button>
    </View>
  );
}