import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ITreeState,TreeNode, ITreeOptions, IActionMapping,TREE_ACTIONS } from 'angular-tree-component';
import { Http } from '@angular/http';
import { v4 } from 'uuid';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit,AfterViewInit {
  questions:any;
  services:any;
  scripts:any;
  nodes: any;
  isInternal:boolean;
  Nodequestion: any[] = [];
  recieve1 = "give me service";
  recieve2 = "give me starting script";
  recieve3 = "give me last Script";
  receivedData: Array<any> = [];
  state: ITreeState = {
    expandedNodeIds: {
      1: true,
      2: true
    },
    hiddenNodeIds: {},
    activeNodeIds: {}
  };
  onMoveNode($event) {
    console.log(
      "Moved",
      $event.node.name,
      "to",
      $event.to.parent.name,
      "at index",
      $event.to.index);
  }
  options: ITreeOptions = {
    displayField: 'question',
    allowDrag: (node) => true,
    getNodeClone: (node) => ({
      ...node.data,
      id: v4(),
      name: `copy of ${node.data.name}`
    }),
    actionMapping: {
          mouse: {
            drop: (tree, node, $event, {from, to}) => {
              console.log('drag', from, to); // from === {name: 'first'}
               this.isInternal=false;
                console.log(from.data);
                console.log(tree);
                console.log($event);
                console.log(tree.node);
                this.nodes = []= tree.nodes;
                console.log(this.nodes);
                //this.checkNode(from,this.nodes );
            console.log(this.isInternal)
            console.log(from.id);
            var element = tree.getNodeBy(from)
console.log(element);
            
             if(from.id==undefined)
             {
               
               node.data.children.splice(to.index,0,{question:from.question,isExternal:false,children:[]});
             }
             else
             {
              var temp = [] = from.data;
              this.removeNode(from,this.nodes );
              console.log(node.data);
             node.data.children.splice(to.index,0,temp);
             console.log(node.data);
              
             }
              tree.update();
              console.log(this.Nodequestion);
            }
          
        },
  },
  levelPadding: 10,
  scrollOnActivate: true,
  };
 
constructor(private http:Http){}

  ngOnInit(){
    
    this.http.get('../assets/nodes.json').subscribe(data=>{
      console.log(JSON.parse(data['_body']));
      this.questions = JSON.parse(data['_body']);
     // this.Nodequestion = JSON.parse(data['_body']);
    })
    this.http.get('../assets/services.json').subscribe(data=>{
      console.log(JSON.parse(data['_body']));
      this.services = JSON.parse(data['_body']);
    })
    this.http.get('../assets/script.json').subscribe(data=>{
      console.log(JSON.parse(data['_body']));
      this.scripts = JSON.parse(data['_body']);

    })
  
  }
ngAfterViewInit(){
  
}

  transferDataSuccess($event: any) {
    this.recieve1 = $event.dragData;
}
transferDataSuccess1($event: any) {
  this.recieve2 = $event.dragData;
}
transferDataSuccess2($event: any) {
  this.recieve3 = $event.dragData;
}

removeNode(from:any,detail:any){
  {
    console.log("hello");
    console.log(detail.length,detail,from.data);
    for(let i=0;i < detail.length;i++){
      console.log("hii");
      console.log(detail[i],from.data)
    if(detail[i] == from.data)
    {
      console.log(detail);
       detail.splice(i,1);
      console.log(detail);
    }
else if 
    (
      detail[i].children != null)
    {
         var j;
         for(j=0;j < detail[i].children.length; j++){
           console.log("in child");
            this.removeNode(from,detail[i].children );
         }
         
    }

}
}
}
makeJson(){
  var service = "";
  var fscript = "";
  var lscript = "";
  for(let i=0;i<this.services.length;i++){
    if(this.services[i].service==this.recieve1){
      service = this.services[i];
    }
  }
  for(let i=0;i<this.scripts.length;i++){
    if(this.scripts[i].script==this.recieve2){
      fscript = this.scripts[i];
    }
    if(this.scripts[i].script==this.recieve3){
      lscript = this.scripts[i];
    }
  }
  if(this.Nodequestion.length == 0){
    console.log("gg");
  }
  {
  this.receivedData.push({
service: service,first_Script: fscript,last_Script: lscript,questions:this.Nodequestion
  })
 console.log(this.receivedData);
}
};


update(data:any,detail:any,node:any){
console.log(data);
console.log(detail);
console.log(detail.dropOnNode)

// if(this.Nodequestion.length == 0)
// {
//     this.Nodequestion.push({id:1,question:data.question,children:[]});
//  }
//  else if(detail.index==0 && detail.dropOnNode==true){
//    for(let i=0;i<this.Nodequestion.length;i++){
//      if(this.Nodequestion[i].id ==detail.parent.data.id){
//       this.Nodequestion[i].children.push({id:detail.parent.data.id+1,question:data.question});
//       break;
//      }
//    }

//  }
//  else if(detail.index==0 && detail.dropOnNode==undefined){
//   this.Nodequestion.push({id:detail.parent.data.id+1,question:data.question,children:[]});
//  }

if(detail.dropOnNode==undefined){

  this.Nodequestion.splice(detail.index, 0,{question:data.question,children:[]});
}
else if(detail.dropOnNode==true && node.parent!=null){
  console.log(this.Nodequestion[1].id);
  console.log(this.Nodequestion[1].children.length);
  console.log(detail.parent.data.id);
  for(let i=0;i<this.Nodequestion.length;i++){
    if(this.Nodequestion[i].id==detail.parent.data.id){
      this.Nodequestion[i].children.splice(detail.index,0,{question:data.data.question})
    }
    else if(this.Nodequestion[i].id != detail.parent.data.id && this.Nodequestion[i].children.length != 0){
      for(let j=0;j<this.Nodequestion[j].children.length;j++){
        if(this.Nodequestion[i].children[j]==detail.parent.data.id){
          this.Nodequestion[i].children[j].splice(detail.index,0,{question:data.data.question})
        }
    }
  console.log("hello")
  console.log(data.data.question);
  this.Nodequestion.splice(detail.index, 0,{question:data.data.question});
}
}

 console.log(this.Nodequestion);
}
}
}
