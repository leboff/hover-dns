const Promise = require('bluebird');
const dns = Promise.promisifyAll(require('dns'));
const colors = require('colors');

module.exports = function(username, password){
    const hover = Promise.promisifyAll(require('hover-api')(username,password));
    
    let updateDns = function(ddns, domain, subdomain){
        let resolvedIp;
        return dns.resolveAsync(ddns)
            .then(function(resolved){
                console.log('Resolved '+colors.yellow(ddns)+' to '+colors.green(resolved[0]));
                resolvedIp = resolved[0];
                //then get domain dns record if successful
                return hover.getDomainDnsAsync(domain);
            })
            .then(function(domainDns){
                console.log('Found domain (' +domainDns[0].id+') ' +colors.green(domainDns[0].domain_name));
                //find the subdomain entry
                return domainDns[0].entries.filter(function(entry){
                    return entry.name == subdomain
                });
            })
            .then(function(entry){
                console.log('Found dns entry ('+entry[0].id+') ' + colors.green(entry[0].name));
                //remove the subdomain entry
                return hover.removeDnsAsync(entry[0].id);
            })
            .then(function(removed){
                //create the new subdomain entry
                console.log('Removed existing entry for '+ colors.red(subdomain+'.'+domain));
                return hover.createARecordAsync(domain,subdomain, resolvedIp);
            })
            .then(function(){
                console.log('Successfully created new domain entry for '+colors.green(subdomain+'.'+domain) + ' -> ' + colors.green(resolvedIp));
            })
            .catch(function(error){
                console.error(error);
            })
    }
    
    return {
        updateDns: updateDns
    }
}