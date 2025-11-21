/* eslint-disable @typescript-eslint/no-explicit-any */
// export function buildDirtyPayload<T extends Record<string, unknown>>(
//   values: T,
//   dirtyFields: Record<string, unknown>,
//   options?: {
//     omitEmptyKeys?: (keyof T)[];
//   }
// ): Partial<T> {
//   const dirtyKeys = Object.keys(dirtyFields) as (keyof T)[];
//   const payload = dirtyKeys.reduce((acc, key) => {
//     acc[key] = values[key];
//     return acc;
//   }, {} as Partial<T>);

//   if (options?.omitEmptyKeys && options.omitEmptyKeys.length > 0) {
//     for (const k of options.omitEmptyKeys) {
//       if (Object.prototype.hasOwnProperty.call(payload, k)) {
//         const v = payload[k];
//         const isEmpty = v === undefined || v === null || v === "";
//         if (isEmpty) {
//           delete payload[k];
//         }
//       }
//     }
//   }

//   return payload;
// }

export function getDirtyData<T extends Record<string, any>>(
  data: T,
  dirtyFields: Partial<Record<keyof T, boolean>>,
  options?: { stripEmpty?: boolean }
): Partial<T> {
  const result: Partial<T> = {};

  Object.keys(dirtyFields).forEach((key) => {
    if (dirtyFields[key as keyof T]) {
      const value = data[key as keyof T];
      // Optionally strip empty values
      if (options?.stripEmpty && (value === undefined || value === null || value === "")) {
        return;
      }
      result[key as keyof T] = value;
    }
  });

  return result;
}

// export function getDirtyDataDeep<T extends Record<string, any>>(
//   data: T,
//   dirty: Partial<Record<keyof T, any>>
// ): Partial<T> {
//   const result: Partial<T> = {};

//   for (const key in dirty) {
//     const typedKey = key as keyof T;
//     const dirtyValue = dirty[typedKey];

//     // Skip null / undefined
//     if (dirtyValue === null || dirtyValue === undefined) continue;

//     // ---- NESTED CASE ----
//     if (
//       typeof dirtyValue === "object" &&
//       !Array.isArray(dirtyValue) &&
//       typeof data[typedKey] === "object"
//     ) {
//       const nested = getDirtyDataDeep(
//         data[typedKey] as Record<string, any>,
//         dirtyValue as Record<string, any>
//       );

//       if (Object.keys(nested).length > 0) {
//         result[typedKey] = nested as T[keyof T];
//       }
//     }

//     // ---- FLAT CASE ----
//     else if (dirtyValue === true) {
//       result[typedKey] = data[typedKey];
//     }
//   }

//   return result;
// }
