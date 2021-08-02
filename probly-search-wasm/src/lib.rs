extern crate console_error_panic_hook;

use core::str;
use std::{collections::HashMap, sync::{Mutex}};
use serde::{Deserialize, Serialize};

use wasm_bindgen::prelude::*;
use lazy_static::lazy_static;
use probly_search::{index::{create_index,Index, add_document_to_index}, query::score::default::{bm25, zero_to_one}};
use probly_search::query::*;


use std::panic;


fn create_default_index() -> Index<usize>
{
    create_index(1)
}
lazy_static! {
    static ref IDX: Mutex<Index<usize>> = Mutex::new(create_default_index());
    static ref DOCUMENTS: Mutex<HashMap<usize, Doc>> = Mutex::new(HashMap::new());

}

#[derive(Serialize, Deserialize, Clone)]

struct Doc
{
    id: usize, 
    text:String
}


fn tokenizer(s: &str) -> Vec<String> {
    s.split(' ')
        .map(|slice| slice.to_lowercase())
        .collect::<Vec<String>>()
}
fn text_accesor(d: &Doc) -> Option<&str> {
    Some(d.text.as_str())
}

fn filter(s: &str) -> String {
    s.to_owned()
}


#[derive(Serialize, Deserialize)]
struct Result 
{
    document:Doc,
    score:f64
}

#[wasm_bindgen]
pub fn save(document: &str) {

    console_error_panic_hook::set_once();
    let mut idx = IDX.lock().unwrap();
    let doc = Doc {
        text: document.to_owned(),
        id: idx.docs.len()
    };
    DOCUMENTS.lock().unwrap().insert(doc.id, doc.clone());
    add_document_to_index(&mut idx,&[text_accesor], tokenizer, filter, doc.id, doc)

}

#[wasm_bindgen]
pub fn search(q: &str, method: &str, size:usize) -> String {

    console_error_panic_hook::set_once();
    let mut idx = IDX.lock().unwrap();
    let resp = match  method {
        "bm25" => 
        {
            query(&mut idx, q, &mut bm25::new(), tokenizer, filter, &[1.], None)

        },
        "zero-to-one" => 
        {
            query(&mut idx, q, &mut zero_to_one::new(), tokenizer, filter, &[1.], None)
        },
        _=>{panic!()}  
    };
    serde_json::to_string(&resp.iter().take(size).map(|r| {
        return Result {
            score: r.score,
            document: DOCUMENTS.lock().unwrap().get(&r.key).unwrap().clone()
        }
    }).collect::<Vec<Result>>()).unwrap()

}


#[wasm_bindgen]
pub fn list() -> String {

    console_error_panic_hook::set_once();
    let conv = DOCUMENTS.lock().unwrap().values().map(|x| x.clone()).collect::<Vec<Doc>>();
    return serde_json::to_string(&conv).unwrap();

}

#[wasm_bindgen]
pub fn clear() {

    let mut idx = IDX.lock().expect("Could not lock mutex");
    *idx = create_default_index();
    DOCUMENTS.lock().unwrap().clear();

}


#[cfg(test)]
mod tests {

    // Just some small test for the methods above
    use super::*;
    #[test]
    fn it_should_add_and_searchable_and_list_and_clear() {
        save(&"hello world");
        let result_bm25 = search("hello", "bm25",10);
        assert_eq!(result_bm25,"[{\"document\":{\"id\":0,\"text\":\"hello world\"},\"score\":0.28768207245178085}]");
        let result_zo = search("hello", "zero-to-one",10);
        assert_eq!(result_zo,"[{\"document\":{\"id\":0,\"text\":\"hello world\"},\"score\":0.5}]");
        let no_results = search("hello", "zero-to-one",0);
        assert_eq!(no_results,"[]");
        assert_eq!(list(),"[{\"id\":0,\"text\":\"hello world\"}]");
        clear();
        assert_eq!(list(),"[]");
        assert_eq!(search("hello", "bm25",10),"[]");

    }


}

