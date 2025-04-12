export class RoleMismatchError extends Error {
    constructor(expected, actual) {
        super(`Role mismatch: expected ${expected}, but found ${actual}. Please select the correct role.`);
        this.name = "RoleMismatchError";
    }
}