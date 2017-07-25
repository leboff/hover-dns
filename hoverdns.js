const Promise = require('bluebird');
const dns = Promise.promisifyAll(require('dns'));


module.exports = function(username, password){
    const hover = Promise.promisifyAll(require('hover-api')(username,password));
    
    let updateDns = function(ddns, domain, subdomain){
        let resolvedIp;
        return dns.resolveAsync(ddns)
            .then(function(resolved){
                console.log('Resolved %s to %s', ddns, resolved[0]);
                resolvedIp = resolved[0];
                //then get domain dns record if successful
                return hover.getDomainDnsAsync(domain);
            })
            .then(function(domainDns){
                console.log('Found domain %s, id: %s', domainDns[0].domain_name, domainDns[0].id);
                //find the subdomain entry
                return domainDns[0].entries.filter(function(entry){
                    return entry.name == subdomain
                });
            })
            .then(function(entry){
                console.log('Found dns entry %s, id: %s', entry[0].name, entry[0].id)
                //remove the subdomain entry
                return hover.removeDnsAsync(entry[0].id);
            })
            .then(function(removed){
                //create the new subdomain entry
                console.log('Removed existing entry for %s.%s', subdomain, domain);
                return hover.createARecordAsync(domain,subdomain, resolvedIp);
            })
            .then(function(){
                console.log('Successfully created new domain entry for %s.%s -> %s',subdomain, domain, resolvedIp);
            })
            .catch(function(error){
                console.error(error);
            })
    }
    
    return {
        updateDns: updateDns
    }
}