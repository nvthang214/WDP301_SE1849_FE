import React from "react";
import "./style.scss";
import { CaretRightOutlined } from "@ant-design/icons";

// Hàm tìm đường dẫn từ root tới item có selectedKey
const findPathToKey = (items, selectedKey, path = []) => {
  for (const item of items) {
    const newPath = [...path, item.key];
    if (item.key === selectedKey) return newPath;
    if (item.children) {
      const result = findPathToKey(item.children, selectedKey, newPath);
      if (result) return result;
    }
  }
  return null;
};

const MenuCustom = ({ items, selectedKey = "" }) => {
  const activePath = findPathToKey(items, selectedKey) || [];

  // Render đệ quy
  const renderMenuItems = (items, level = 1) => {
    if (level >= 3) {
      return (
        <ul className="menu__custom--menu__level">
          <div>
            {items.map((item) => {
              const isActive = activePath.includes(item.key);
              const isSelected = selectedKey === item.key;
              return (
                <li
                  key={item.key}
                  className={`menu__custom--menu__level--menu__item ${
                    isActive ? "item__active" : ""
                  } ${
                    level >= 2 && item.children?.length > 0
                      ? "sub__item_have_border"
                      : ""
                  }`}
                  onClick={item.onClick}
                  onMouseEnter={(e) => {
                    if (item.key) {
                      e.currentTarget.classList.add("item__active");
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (item.key && !isActive) {
                      e.currentTarget.classList.remove("item__active");
                    }
                  }}
                >
                  <span
                    className={`menu__custom--menu__level--menu__item--menu__label ${
                      isSelected ? "selected__key" : ""
                    }`}
                  >
                    {item.label}

                    {/* Nếu từ cấp 2 trở đi và có children thì hiển thị dấu ">" */}
                    {level >= 2 && item.children?.length > 0 && (
                      <span className="menu__custom--menu__level--menu__item--arrow">
                        <CaretRightOutlined />
                      </span>
                    )}
                  </span>

                  {item.children?.length > 0 &&
                    renderMenuItems(item.children, level + 1)}
                </li>
              );
            })}
          </div>
        </ul>
      );
    }
    if (level >= 2) {
      return (
        <ul className="menu__custom--menu__level">
          <div className="menu__custom--menu__level--menu">
            {items.map((item) => {
              const isActive = activePath.includes(item.key);
              const isSelected = selectedKey === item.key;
              return (
                <li
                  key={item.key}
                  className={`menu__custom--menu__level--menu__item ${
                    isActive ? "item__active" : ""
                  } ${
                    level >= 2 && item.children?.length > 0
                      ? "sub__item_have_border"
                      : ""
                  }`}
                  onClick={item.onClick}
                  onMouseEnter={(e) => {
                    if (item.key) {
                      e.currentTarget.classList.add("item__active");
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (item.key && !isActive) {
                      e.currentTarget.classList.remove("item__active");
                    }
                  }}
                >
                  <span
                    className={`menu__custom--menu__level--menu__item--menu__label ${
                      isSelected ? "selected__key" : ""
                    }`}
                  >
                    {item.label}

                    {/* Nếu từ cấp 2 trở đi và có children thì hiển thị dấu ">" */}
                    {level >= 2 && item.children?.length > 0 && (
                      <span className="menu__custom--menu__level--menu__item--arrow">
                        <CaretRightOutlined />
                      </span>
                    )}
                  </span>

                  {item.children?.length > 0 &&
                    renderMenuItems(item.children, level + 1)}
                </li>
              );
            })}
          </div>
        </ul>
      );
    }
    return (
      <ul className="menu__custom--menu__level">
        {items.map((item) => {
          const isActive = activePath.includes(item.key);
          const isSelected = selectedKey === item.key;
          return (
            <li
              key={item.key}
              className={`menu__custom--menu__level--menu__item ${
                isActive ? "item__active" : ""
              } ${
                level >= 2 && item.children?.length > 0
                  ? "sub__item_have_border"
                  : ""
              }`}
              onClick={item.onClick}
              onMouseEnter={(e) => {
                if (item.key) {
                  e.currentTarget.classList.add("item__active");
                }
              }}
              onMouseLeave={(e) => {
                if (item.key && !isActive) {
                  e.currentTarget.classList.remove("item__active");
                }
              }}
            >
              <span
                className={`menu__custom--menu__level--menu__item--menu__label ${
                  isSelected ? "selected__key" : ""
                }`}
              >
                {item.label}

                {/* Nếu từ cấp 2 trở đi và có children thì hiển thị dấu ">" */}
                {level >= 2 && item.children?.length > 0 && (
                  <span className="menu__custom--menu__level--menu__item--arrow">
                    <CaretRightOutlined />
                  </span>
                )}
              </span>

              {item.children?.length > 0 &&
                renderMenuItems(item.children, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return <nav className="menu__custom">{renderMenuItems(items, 1)}</nav>;
};

export default MenuCustom;
