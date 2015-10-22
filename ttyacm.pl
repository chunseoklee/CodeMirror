#!/usr/bin/perl -w
use strict;

open(my $FH, "+<", "/dev/ttyACM0") or die "Failed to open com port acm0";
print $FH ("\n\n\n");

my $cmd = $ARGV[0] || "/mnt/sdcard/ledserver.js"; # default cmd

print $FH ("iotjs " . $cmd . "\n");

while(my $line = <$FH>) {
  print $line;
  if ($line =~ /MEM/) {
    close($FH);
    exit(1);
  }
}

close($FH);
