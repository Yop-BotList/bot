module.exports=(options)=>{
    let { messages, bots, title } = options, body = ``, embed = ``, field = ``, buttonColor= "";

    messages.forEach(x => {
        const { author, content, components } = x;
        let avatar;
        if (author.bot && bots !== true) return;
        if (author.avatar) avatar = `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png`;

        components?.forEach(y => {
            if (y.components.style === "PRIMARY") buttonColor="#5865f2";
            if (y.components.style === "SECONDARY") buttonColor="grey";
            if (y.components.style === "SUCCESS") buttonColor="green";
            if (y.components.style === "DANGER") buttonColor="red";
            if (y.components.style === "LINK") buttonColor="grey";
        });

        if (x.embeds?.lenght !== 0) {
            x.embeds.forEach(y=>{
                const color=y.color?.toString(16)||"000000",fields=y.fields;
                fields.forEach(z=>field=field+`
            <div class="embed-field">
                <div class="field-name">${z.name}</div>
                <div class="field-value">${z.value}</div>
            </div>\n`);
            
                embed=embed+`
        <div class="embed" style="width: 700px; height: auto+10px; border-radius: 15px; background-color: #2F3140; border: 1px solid black; border-left: 5px solid #${color}">
            <div class="embed-author">${y.author?.name||""}</div>
            ${y.url?`<a href="${y.url}">${y.title||""}</a>`:`<div class="embed-title">${y.title||""}</div>`}
            <div class="embed-desc">${y.description||""}</div>\n
            ${field}
            ${y.image?.url?`<div class="embed-image"><img src="${y.image?.url}"></div>`:""}\n
            <div class="embed-footer">${y.footer?.text||""}${(y.footer?.text&&y.timestamp)?" • ":""}${y.timestamp||""}</div>
        </div>\n\n`;
        
                field=``;
            });
            
            body=body+`
        <p><img src="${avatar}" width="25px" height="25px" style="border-radius: 50%; margin-right: 10px">${author.username}#${author.discriminator}</p>
        ${content ? `<p>${content}</p>` : ``}
        ${embed}`;
        
        embed=``;
        }else body=body+`
        <p><img src="${avatar}" width="25px" height="25px" style="border-radius: 50%; margin-right: 10px">${author.username}#${author.discriminator}</p>
        <p>${content}</p>\n\n`;
    });
    
    return `<!DOCTYPE html>
<html>
    <head>
        <title>${title}</title>
        <meta charset="utf-8">
    </head>
    <body>
        ${body}
    </body>
</html>

<style>
    body{ background-color: #2F3136; }
    p{ color: white; }
    a{ margin: 10px; text-decoration: none; color: blue; }

    .embed-author{
        color: white;
        font-weight: 700;
        margin: 10px;
        width: 400px;
    }
    .embed-title{
        color: white;
        font-weight: 700;
        margin: 10px;
    }
    .embed-desc{
        color: white;
        margin: 10px;
        width: 400px;
    }
    .embed-field{
        color: white;
        margin: 10px;
        width: 400px;
    }
    .field-name{
        font-weight: 700;
        margin-bottom: 2px;
    }
    .embed-image{
        margin: 10px;
    }
    .embed-footer{
        color: white;
        margin: 10px;
    }
</style>`;
}
