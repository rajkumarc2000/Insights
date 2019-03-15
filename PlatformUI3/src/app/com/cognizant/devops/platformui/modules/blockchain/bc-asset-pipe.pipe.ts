import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assetPipe'
})
export class AssetPipe implements PipeTransform {

  transform(val) {
    let data = '';
    Object.keys(val).map((f) => {
      const key = f[0].toUpperCase() + f.substring(1);
      if (key === 'Moddate' || key === 'TxID' || key === 'AssetID' || key === 'InnerObjAsset') {
        return;
      }else if(val[f]!='undefined' && val[f].toString().startsWith("http")){
        data += `<b>${key}</b><span> : <a href="${val[f]}">${val[f]}</a></span><br/>`;
      }else {
        data += `<b>${key}</b><span> : ${(val[f] === 'null' || val[f] === '') ? 'N/A' : val[f].toString()}</span><br/>`;
      }
    })
    console.log(data);
    return data;
    // return JSON.stringify(obj, this.replacer, 4).replace(/"/g, '').replace(/{/, '').replace(/}/, '');
  }

  // replacer(key, value) {
  //   if (key === '<b>Moddate</b>' || key === '<b>TxID</b>') {
  //     return;
  //   }
  //   if (value === 'null' || value === '') {
  //     return 'N/A';
  //   } else {

  //   }
  //   return value;
  // }
}