export function asyncHandler(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}

export function hasPdfSignature(buffer) {
  return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
}
