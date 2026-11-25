import {test} from 'node:test';import assert from 'node:assert/strict';import {readSession,readArchive,writeStored,withoutImages} from '../src/services/sessionStorage.ts';
const session={id:'one',createdAt:'2026-11-25',updatedAt:'2026-11-25',completedSteps:[],images:{faceImage:'private'}};
const store=value=>({getItem:()=>value,setItem(){},removeItem(){}});
test('corrupt and invalid sessions fail closed',()=>{for(const v of ['{','null','[]','{}','{"id":"x","completedSteps":false}'])assert.equal(readSession(store(v),'key'),null)});
test('archives filter invalid entries and omit sensitive images',()=>{const list=readArchive(store(JSON.stringify([session,null,{},'bad'])),'key');assert.equal(list.length,1);assert.equal(list[0].images,undefined);assert.equal(session.images.faceImage,'private')});
test('images omitted without mutating live session',()=>{assert.equal(withoutImages(session).images,undefined);assert(session.images)});
test('storage quota/denial returns failure instead of throwing',()=>{assert.equal(writeStored({setItem(){throw Error('quota')}},'key',session),false);assert.equal(readSession({getItem(){throw Error('denied')}},'key'),null)});
