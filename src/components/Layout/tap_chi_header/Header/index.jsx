import React from "react";
import MenuCustom from "../../MenuCustom";
const items = [
  {
    key: "1sdfdg" + Math.random().toString(36).substring(2, 15),
    label: "home sdfsdfsd sdfsdf",
    icon: "",
    path: "/",
    children: [
      {
        key: "2q413c" + Math.random().toString(36).substring(2, 15),
        label: "about-1",
        icon: "",
        path: "/",
        children: [],
      },
      {
        key: "2q413c" + Math.random().toString(36).substring(2, 15),
        label: "about-1",
        icon: "",
        path: "/",
        children: [],
      },
      {
        key: "2q413c" + Math.random().toString(36).substring(2, 15),
        label: "about-1",
        icon: "",
        path: "/",
        children: [],
      },
      {
        key: "2q413c" + Math.random().toString(36).substring(2, 15),
        label: "about-1",
        icon: "",
        path: "/",
        children: [],
      },
    ],
    onClick: () => {
      window.location.reload();
    },
  },
  {
    key: "ktuihbgv" + Math.random().toString(36).substring(2, 15),
    label: "about",
    icon: "",
    path: "/",
    children: [
      {
        key: "2q413c" + Math.random().toString(36).substring(2, 15),
        label: "about-1",
        icon: "",
        path: "/",
        children: [
          {
            key: "2q413c" + Math.random().toString(36).substring(2, 15),
            label: "about-1",
            icon: "",
            path: "/",
            children: [],
          },
          {
            key: "2q413c" + Math.random().toString(36).substring(2, 15),
            label: "about-1",
            icon: "",
            path: "/",
            children: [
              {
                key: "2q413c" + Math.random().toString(36).substring(2, 15),
                label: "about-1",
                icon: "",
                path: "/",
                children: [],
              },
              {
                key: "2q413c" + Math.random().toString(36).substring(2, 15),
                label: "about-1",
                icon: "",
                path: "/",
                children: [],
              },
            ],
          },
        ],
      },
      {
        key: "2q413c" + Math.random().toString(36).substring(2, 15),
        label: "about-1",
        icon: "",
        path: "/",
        children: [],
      },
      {
        key: "2q413c" + Math.random().toString(36).substring(2, 15),
        label: "about-1",
        icon: "",
        path: "/",
        children: [],
      },
      {
        key: "2q413c" + Math.random().toString(36).substring(2, 15),
        label: "about-1",
        icon: "",
        path: "/",
        children: [],
      },
    ],
  },
  {
    key: "895etygtasdcvf" + Math.random().toString(36).substring(2, 15),
    label: "key",
    icon: "",
    path: "",
    children: [],
  },
];
const HeaderMain = () => {
  return (
    <div
      style={{
        margin: "20px 0",
      }}
    >
      <MenuCustom items={items} selectedKey="1sdfdg" />
    </div>
  );
};

export default HeaderMain;
