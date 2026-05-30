const fs = require('fs');

['builder', 'cover-letter', 'dashboard'].forEach(d => {
    const p = `src/app/[lang]/${d}/page.tsx`;
    if (fs.existsSync(p)) {
        let c = fs.readFileSync(p, 'utf8');
        c = c.replace(/from "\.\.\/\.\.\/\.\.\/actions"/g, 'from "../../actions"');
        fs.writeFileSync(p, c);
        console.log('Fixed ' + p);
    }
});
