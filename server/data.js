import db from "./data";
import connection from "./mongo";
export async function getBooks() {
    console.log("getting books");
    const books = await connection.db
        .collection("books")
        .find()
        .toArray();
    console.log("books", books);
    return books;
}
