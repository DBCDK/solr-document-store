#!/usr/bin/perl

$| = 1;

use strict;
use Time::HiRes qw( time );
use DBI;
use POSIX;

my $start = time();

sub elapsed() {
    my $e = floor((time() - $start) * 1000);
    my @a = ();
    for my $d (qw{1000 60 60}) {
	unshift(@a, $e % $d);
	$e = floor($e / $d);
    }
    unshift(@a, $e * 1);
    printf("elapsed %d:%02d:%02d.%03d\n", @a);
}

my($db, $agency) = @ARGV;

die("Invalid database connect string\n") unless($db =~ m{^(.+?):(.+?)\@(.+?)(?::(\d+))?/(.+)$}ms);
my($user,$pass,$host,$port,$base) = ($1, $2, $3, ($4 or 5432), $5);

my $dbh = DBI->connect("dbi:Pg:host=$host;port=$port;dbname=$base", $user, $pass, {AutoCommit => 0, RaiseError => 1, PrintError => 1});
die("Cannot connect to db: $DBI::errstr\n") unless($dbh);

$dbh->do("DROP TABLE IF EXISTS bib_$agency");
$dbh->do("CREATE TEMP TABLE bib_$agency AS TABLE bibliographicsolrkeys WITH NO DATA");

print("Insert into temp\n");
$_ = $dbh->do("INSERT INTO bib_$agency(agencyid, bibliographicrecordid, work, unit, producerversion, deleted, indexkeys, trackingid, classifier) SELECT agencyid, bibliographicrecordid, work, unit, producerversion, deleted, indexkeys, trackingid, CASE WHEN deleted THEN 'DELETED' ELSE indexkeys#>>'{original_format,0}' END AS classifier FROM bibliographicsolrkeys WHERE agencyid=?", {}, $agency);
print("rows: $_ (total)\n");
elapsed;

print("Delete from main\n");
$_ = $dbh->do("DELETE FROM bibliographicsolrkeys WHERE agencyid=?", {}, $agency);
print("rows: $_\n");
elapsed;

my $bibl;
my $total = 0;
while(($bibl) = $dbh->selectrow_array("SELECT bibliographicrecordid FROM bib_$agency WHERE agencyid=? ORDER BY agencyid, bibliographicrecordid OFFSET 25000 LIMIT 1", {}, $agency)) {
    print("next bibl is $bibl\n");
    $_ = $dbh->do("INSERT INTO bibliographicsolrkeys(agencyid, bibliographicrecordid, work, unit, producerversion, deleted, indexkeys, trackingid, classifier) SELECT agencyid, bibliographicrecordid, work, unit, producerversion, deleted, indexkeys, trackingid, CASE WHEN classifier IS NULL THEN 'UNKNOWN' ELSE classifier END AS classifier FROM bib_$agency WHERE agencyid=? AND bibliographicrecordid < ?", {}, $agency, $bibl);
    $total = $total + $_;
    print("rows: $_ ($total)\n");
    $_ = $dbh->do("DELETE FROM bib_$agency WHERE agencyid=? AND bibliographicrecordid < ?", {}, $agency, $bibl);
    print("rows: $_ (deleted)\n");
    elapsed;

    $dbh->commit();
    print("committed\n");
    elapsed;
}

$_ = $dbh->do("INSERT INTO bibliographicsolrkeys(agencyid, bibliographicrecordid, work, unit, producerversion, deleted, indexkeys, trackingid, classifier) SELECT agencyid, bibliographicrecordid, work, unit, producerversion, deleted, indexkeys, trackingid, CASE WHEN classifier IS NULL THEN 'UNKNOWN' ELSE classifier END AS classifier FROM bib_$agency");
print("rows: $_\n");
elapsed;

$dbh->commit();
print("committed\n");
elapsed;

$dbh->do("DROP TABLE IF EXISTS bib_$agency");
$dbh->disconnect();
print("Done\n");
